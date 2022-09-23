import { defineStore } from 'pinia'
import { useDefStore } from '@/stores/defs'
import { v4 as uuidv4 } from "uuid";
import { any, clone, filter, join, map, reject, take } from 'ramda';
import { stringify } from 'csv-stringify/browser/esm/sync';
import type { Dictionary } from "@/dictionary"
import { ankiService } from '@/services'
import { AnkiForm } from './anki.form';

type State = {
  form: AnkiForm,
  decks: string[]
}

export const useAnkiStore = defineStore('anki', {
  state: (): State => ({
    form: new AnkiForm(),
    decks: []
  }),
  actions: {
    async createDeck() {
      const newAnkiDeck = this.form.newAnkiDeck
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
      defStore.allDefs.filter(def => !def.inAnki).forEach(async def => {
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
      })
    }
  }
})
