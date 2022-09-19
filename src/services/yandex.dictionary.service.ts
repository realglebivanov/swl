import type { Dictionary } from "@/dictionary"
import { Axios } from "axios"
import { map, groupBy } from "ramda"
import qs from "node:querystring"
import type { Def } from "@/stores/defs"

export type LookupResponse = {
    head: {},
    def: Def[]
}

export class YandexDictionaryService {
    private axios: Axios

    public constructor(
        token: string
    ) {
        this.axios = new Axios({
            baseURL: 'https://dictionary.yandex.net/api/v1/dicservice.json',
            timeout: 1000,
            paramsSerializer: qs.encode,
            params: { key: token }
        })
    }

    public async getLangs(): Promise<Dictionary<string[]>> {
        const langs = await this.request<string[]>('/getLangs', {})
        return map(
            (langPairs: string[][]) => map(([_sourceLang, targetLang]) => targetLang, langPairs),
            groupBy(
                ([sourceLang, _targetLang]) => sourceLang,
                map(langStr => langStr.split('-'), langs)))
    }

    public async lookup(sourceLang: string, targetLang: string, text: string) {
        return await this.request<LookupResponse>('/lookup', { lang: `${sourceLang}-${targetLang}`, text: text })
    }

    private async request<T>(endpoint: string, params: Dictionary<string>) {
        const response = await this.axios
            .get(endpoint, { params: params }).catch(reason => reason)
        return JSON.parse(response.data) as T
    }
}