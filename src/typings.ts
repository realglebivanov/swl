import type { YandexDictionary } from './services/yandex.dictionary'

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $yandexDictionary: YandexDictionary
    }
}