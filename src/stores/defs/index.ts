export { DefForm } from './def.form'
export { type Def } from './def'

import { defineStore } from 'pinia'
import { v4 as uuidv4 } from "uuid";
import { clone, filter, join, map, reject, take } from 'ramda';
import { stringify } from 'csv-stringify/browser/esm/sync';
import type { Dictionary } from "@/dictionary"
import type { Def, Tr } from './def';
import { dictionaryService, ipcService } from '@/services'
import { DefForm } from './def.form';

type HistoryListEntry = { key: string, timestamp: number }

interface State {
  defs: Def[],
  sourceLangs: string[],
  targetLangs: Dictionary<string[]>,
  history: Dictionary<number>,
  historyList: HistoryListEntry[],
  form: DefForm
}

export const useDefStore = defineStore('defs', {
  state: (): State => ({
    defs: [],
    sourceLangs: [],
    targetLangs: {},
    history: {},
    historyList: [],
    form: new DefForm()
  }),
  getters: {
    allDefs: (state: State) => state.defs,
    filteredDefs: (state: State) => {
      const { phrase, partOfSpeech } = state.form
      const substrMatches = reject((def: Def) => def.text.indexOf(phrase) == -1, state.defs);
      return partOfSpeech == 'any' ?
        substrMatches :
        filter((def: Def) => def.pos == partOfSpeech, substrMatches)
    },
    formInHistory: (state: State) => state.history[state.form.getFormKey()] !== undefined
  },
  actions: {
    exportAll() {
      const options = {
        title: "Save file",
        defaultPath: "newWords.csv",
        buttonLabel: "Save",
        filters: [{ name: 'csv', extensions: ['csv'] }]
      };

      ipcService.showSaveDialog(options).then(({ filePath, canceled }) => {
        if (filePath !== undefined && !canceled) {
          const csv = stringify(this.defs.map(def =>
            [def.text, join('/', map((tr: Tr) => tr.text, take(3, def.tr)))]))
          ipcService.writeFile(filePath, csv, "utf-8");
        }
      });
    },
    remove(rDef: Def) {
      this.defs = reject((def: Def) => def.id == rDef.id, this.defs)
      delete this.history[rDef.historyKey]
    },
    async fetchLangs() {
      const targetLangs = await dictionaryService.getLangs()
      this.targetLangs = targetLangs
      this.sourceLangs = Object.keys(targetLangs)
    },
    async lookup() {
      const tempForm = clone(this.form)
      const { sourceLang, targetLang, phrase, partOfSpeech } = tempForm
      const timestamp = Date.now()

      let { def: defs } = await dictionaryService.lookup(sourceLang, targetLang, phrase)
      defs = partOfSpeech == "any" ? defs : filter(def => def.pos == partOfSpeech, defs)
      defs = defs.map((def: Def) => ({ ...def, id: uuidv4(), historyKey: tempForm.getDefKey(def) }))
      this.defs = defs.concat(this.defs)

      this.historyList = this.historyList.concat(
        defs.map(({ historyKey }) => ({ key: historyKey, timestamp: timestamp })))
      defs.forEach(({ historyKey }) => this.history[historyKey] = timestamp)
    }
  }
})
