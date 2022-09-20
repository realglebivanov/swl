import { IPCService } from "./ipc.service"
import { YandexDictionaryService } from "./yandex.dictionary.service"

export const dictionaryService = new YandexDictionaryService(
  'dict.1.1.20220918T214714Z.712dfcb43dacbf0e.8dacdffcf53ff5f9aadaecc72e22f0c8649ae192')
export const ipcService = new IPCService()