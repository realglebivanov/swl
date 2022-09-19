import { defineStore, type Store, type StoreDefinition, type _GettersTree } from 'pinia'
import type { Dictionary } from "@/dictionary"
import { YandexDictionaryService } from '@/services/yandex.dictionary.service'
import { v4 as uuidv4 } from "uuid";
import { map, reject } from 'ramda';
import { IPCService } from '@/services/ipc.service';
import type { SaveDialogReturnValue } from 'electron';

interface State {
  defs: Def[],
  sourceLangs: string[],
  targetLangs: Dictionary<string[]>,
  // dictionaryService: YandexDictionaryService,
  // ipcService: IPCService
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

const services = {
  dictionaryService: new YandexDictionaryService(
    'dict.1.1.20220918T214714Z.712dfcb43dacbf0e.8dacdffcf53ff5f9aadaecc72e22f0c8649ae192'),
  ipcService: new IPCService()
}

export const useDefStore = defineStore('defs', {
  state: (): State => ({
    defs: [],
    sourceLangs: [],
    targetLangs: {},
  }),
  getters: {
    allDefs: (state: State) => state.defs
  },
  actions: {
    exportAll() {
      const options = {
        title: "Save file",
        defaultPath: "newWords",
        buttonLabel: "Save",

        filters: [
          { name: 'txt', extensions: ['txt'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      };

      services.ipcService.showSaveDialog(options).then(({ filePath, canceled }: SaveDialogReturnValue) => {
        if (filePath != undefined && !canceled) {
          services.ipcService.writeFile(filePath, "hello world", 'utf-8');
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
      const targetLangs = await services.dictionaryService.getLangs()
      this.targetLangs = targetLangs
      this.sourceLangs = Object.keys(targetLangs)
    },
    async lookup(sourceLang: string, targetLang: string, phrase: string) {
      const { def: def } = await services.dictionaryService.lookup(sourceLang, targetLang, phrase)
      this.defs = map((def: Def) => ({ ...def, id: uuidv4() }), def).concat(this.defs)
    }
  }
})
