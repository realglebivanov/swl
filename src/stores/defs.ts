import { defineStore } from 'pinia'
import type { Dictionary } from "@/dictionary"
import { dictionaryService, ipcService } from '@/services'
import { v4 as uuidv4 } from "uuid";
import { filter, join, map, reject, take } from 'ramda';
import { stringify } from 'csv-stringify/browser/esm/sync';
import type { AppForm } from '@/app.form';

interface State {
  defs: Def[],
  sourceLangs: string[],
  targetLangs: Dictionary<string[]>,
  history: Dictionary<number>,
  historyList: { key: string, timestamp: number }[]
}

export interface Tr {
  text: string,
  pos: string,
  syn: { text: string }[],
  mean: { text: string }[],
  ex: { text: string, tr: { text: string }[] }[]
}

export interface Def {
  id: string,
  text: string,
  pos: string,
  ts: string,
  tr: Tr[]
}

export const useDefStore = defineStore('defs', {
  state: (): State => ({
    defs: [],
    sourceLangs: [],
    targetLangs: {},
    history: {},
    historyList: []
  }),
  getters: {
    allDefs: (state: State) => state.defs,
    filterDefs: (state: State) => ({ phrase, partOfSpeech }: AppForm) => {
      const substrMatches = reject((def: Def) => def.text.indexOf(phrase) == -1, state.defs);
      return partOfSpeech == 'any' ?
        substrMatches :
        filter((def: Def) => def.pos == partOfSpeech, substrMatches)
    },
    formInHistory: (state: State) => (form: AppForm) => state.history[form.getKey()] !== undefined
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
    removeAll() {
      this.defs = []
    },
    remove(rDef: Def) {
      this.defs = reject((def: Def) => def.id == rDef.id, this.defs)
    },
    async fetchLangs() {
      const targetLangs = await dictionaryService.getLangs()
      this.targetLangs = targetLangs
      this.sourceLangs = Object.keys(targetLangs)
    },
    async lookup(appForm: AppForm) {
      const { sourceLang, targetLang, phrase, partOfSpeech } = appForm
      const historyKey = appForm.getKey();
      const timestamp = Date.now()

      let { def: defs } = await dictionaryService.lookup(sourceLang, targetLang, phrase)
      defs = partOfSpeech == "any" ? defs : filter(def => def.pos == partOfSpeech, defs)
      this.defs = map((def: Def) => ({ ...def, id: uuidv4() }), defs).concat(this.defs)

      this.historyList.push({ key: historyKey, timestamp: timestamp })
      this.history[historyKey] = timestamp
    }
  }
})
