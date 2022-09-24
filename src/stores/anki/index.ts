import { defineStore } from 'pinia'
import { useDefStore } from '@/stores/defs'
import { clone, uniqBy } from 'ramda';
import { ankiService, ipcService } from '@/services'
import type { CardTemplate } from '@/services/anki.service'
import { AnkiForm } from './anki.form';
import type { Dictionary } from '@/dictionary';

type State = {
  form: AnkiForm,
  decks: string[],
  exportedKeys: Set<string>,
  modelNamesAndIds: Dictionary<number>
}

export const useAnkiStore = defineStore('anki', {
  state: (): State => ({
    form: new AnkiForm(),
    decks: [],
    exportedKeys: new Set(),
    modelNamesAndIds: {}
  }),
  actions: {
    async createDefaultModels() {
      const modelNamesAndIds = await ankiService.invoke("modelNamesAndIds", undefined)
      const directCardTemplate = {
        Name: "Direct",
        Front: "{{Word}}",
        Back: "{{Translation}}"
      }
      const invertedCardTemplate = {
        Name: "Inverted",
        Front: "{{Translation}}",
        Back: "{{Word}}"
      }
      ankiService.getDefaultModelNames()
        .filter(modelName => !(modelName in modelNamesAndIds))
        .forEach(async modelName => {
          const cardTemplates: CardTemplate[] = [];
          switch (modelName) {
            case "swl-basic":
              cardTemplates.push(directCardTemplate)
              break;
            case "swl-reversed-card":
              cardTemplates.push(directCardTemplate)
              cardTemplates.push(invertedCardTemplate)
              break;
            default:
              throw new Error("Unsupported default model")
          }
          const { id: newModelId } = await ankiService.invoke("createModel", {
            modelName,
            inOrderFields: ["Word", "Translation"],
            cardTemplates,
            isCloze: false
          })
          modelNamesAndIds[modelName] = newModelId
        })
      this.modelNamesAndIds = modelNamesAndIds
    },
    async deleteDeck() {
      const deckName = this.form.ankiDeck
      await ankiService.invoke("deleteDecks", { decks: [deckName], cardsToo: true })
      this.decks = this.decks.filter(name => name != deckName)
      this.form.ankiDeck = ""
    },
    async createDeck() {
      const newAnkiDeck = this.form.newAnkiDeck
      await ankiService.invoke("createDeck", { deck: newAnkiDeck })
      this.decks.push(newAnkiDeck)
      this.form.newAnkiDeck = newAnkiDeck
    },
    async fetchDecks() {
      this.decks = await ankiService.invoke("deckNames", undefined)
    },
    async exportAll() {
      const defStore = useDefStore()
      const form = clone(this.form)
      uniqBy(
        def => def.historyKey,
        defStore.allDefs.filter(def => !this.exportedKeys.has(def.historyKey)))
        .forEach(async def => {
          const [text, translations] = def.buildCsvRecord()
          await ankiService.invoke("addNote", {
            note: {
              deckName: form.ankiDeck,
              modelName: form.ankiModel,
              fields: {
                Word: text,
                Translation: translations
              },
              options: {
                allowDuplicate: false,
                duplicateScope: "deck",
                duplicateScopeOptions: {
                  deckName: form.ankiDeck,
                  checkChildren: true,
                  checkAllModels: true
                }
              },
              tags: [],
              audio: [],
              video: [],
              picture: []
            }
          })
          def.inAnki = true
          this.exportedKeys.add(def.historyKey)
        })
      await ankiService.invoke('sync', undefined)
      ipcService.showMessageBox({
        message: "Successfully exported new cards to Anki!",
        type: "info",
        title: "Success"
      })
    }
  }
})
