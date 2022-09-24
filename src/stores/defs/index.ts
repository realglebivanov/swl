export { DefForm } from './def.form'
export { type Def, DefRecord } from './def'

import { defineStore } from 'pinia'
import { any, clone, filter, reject } from 'ramda';
import { stringify } from 'csv-stringify/browser/esm/sync';
import type { Dictionary } from "@/dictionary"
import { type Def, DefRecord } from './def';
import { dictionaryService, ipcService } from '@/services'
import { DefForm } from './def.form';

type HistoryListEntry = { def: DefRecord, form: DefForm, timestamp: number }

interface State {
  defs: DefRecord[],
  sourceLangs: string[],
  targetLangs: Dictionary<string[]>,
  history: HistoryListEntry[],
  queriedAt: Dictionary<number>,
  form: DefForm
}

export const useDefStore = defineStore('defs', {
  state: (): State => ({
    defs: [],
    sourceLangs: [],
    targetLangs: {},
    history: [],
    queriedAt: {},
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
    queriedDefPresent: (state: State) => any(
      (historyKey: string) => historyKey in state.queriedAt,
      state.form.getFormKeys())
  },
  actions: {
    exportToFile() {
      const options = {
        title: "Save file",
        defaultPath: "newWords.csv",
        buttonLabel: "Save",
        filters: [{ name: 'csv', extensions: ['csv'] }]
      };

      ipcService.showSaveDialog(options).then(({ filePath, canceled }) => {
        if (filePath !== undefined && !canceled) {
          const csv = stringify(this.defs.map(def => def.buildCsvRecord()))
          ipcService.writeFile(filePath, csv, "utf-8").then(
            () => {
              ipcService.showMessageBox({
                message: `Successfully exported new cards to ${filePath}`,
                type: "info",
                title: "Success"
              })
            },
            () => {
              ipcService.showMessageBox({
                message: "Error during writing new cards to file",
                type: "error",
                title: "Error"
              })
            });
        }
      });
    },
    remove(def: DefRecord) {
      this.defs = reject(({ id }: DefRecord) => id == def.id, this.defs)
      delete this.queriedAt[def.historyKey]
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
      const records = defs.map((def: Def) => DefRecord.buildFromData(def, tempForm))
      this.defs = records.concat(this.defs)

      records.forEach(def => {
        this.queriedAt[def.historyKey] = timestamp
        this.history.push({ def: def, form: tempForm, timestamp: timestamp })
      })
    }
  }
})
