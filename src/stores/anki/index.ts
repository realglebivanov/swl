import { defineStore } from 'pinia'
import { useDefStore } from '@/stores/defs'
import { clone, uniqBy } from 'ramda';
import { ankiService } from '@/services'
import { AnkiForm } from './anki.form';

type State = {
  form: AnkiForm,
  decks: string[],
  exportedKeys: Set<string>
}

export const useAnkiStore = defineStore('anki', {
  state: (): State => ({
    form: new AnkiForm(),
    decks: [],
    exportedKeys: new Set()
  }),
  actions: {
    async deleteDeck() {
      const deckName = this.form.ankiDeck
      await ankiService.invoke("deleteDecks", { decks: [deckName], cardsToo: true })
      this.decks = this.decks.filter(name => name != deckName)
      this.form.ankiDeck = ""
    },
    async createDeck() {
      const newAnkiDeck = this.form.newAnkiDeck
      this.form.newAnkiDeck = ''
      await ankiService.invoke("createDeck", { deck: newAnkiDeck })
      this.decks.push(newAnkiDeck)
    },
    async fetchDecks() {
      const response = await ankiService.invoke("deckNames", undefined)
      if (response.result == null) throw new Error("Failed to fetch anki decks")
      this.decks = response.result
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
              modelName: "Basic",
              fields: {
                "Back": translations,
                "Front": text
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
    }
  }
})
