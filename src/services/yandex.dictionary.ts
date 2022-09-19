import type { Dictionary } from "@/dictionary"
import { Axios } from "axios"
import { map, groupBy } from "ramda"
import qs from "node:querystring"
import { v4 as uuidv4 } from "uuid";

export type LookupResponseTr = {
    text: string,
    pos: string,
    syn: { text: string }[],
    mean: { text: string }[],
    ex: { text: string, tr: { text: string }[] }[]
}

export type LookupResponseDef = {
    text: string,
    pos: string,
    ts: string,
    tr: LookupResponseTr[]
}

export type LookupResponse = {
    id: string,
    head: {},
    def: LookupResponseDef[]
}

export class YandexDictionary {
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
        const lookupResponse = await this.request<LookupResponse>('/lookup', { lang: `${sourceLang}-${targetLang}`, text: text })
        return Object.assign(lookupResponse, { id: uuidv4() }) as LookupResponse
    }

    private async request<T>(endpoint: string, params: Dictionary<string>) {
        const response = await this.axios
            .get(endpoint, { params: params }).catch(reason => reason)
        return JSON.parse(response.data) as T
    }
}