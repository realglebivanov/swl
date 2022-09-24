import { Axios } from "axios"

type RequestType = "deckNames" | "createDeck" | "addNote" | "deleteDecks"

type DuplicateScope = "deck"

type NoteField = "Front" | "Back"

type ModelName = "Basic"

type MultimediaObject = {
  url: string,
  filename: string,
  skipHash: string,
  fields: NoteField[]
}

type RequestParams<A extends RequestType> = Fetch<{
  createDeck: { deck: string },
  deckNames: undefined,
  addNote: {
    note: {
      deckName: string,
      modelName: ModelName,
      fields: {
        [K in NoteField]: string
      },
      options: {
        allowDuplicate: boolean,
        duplicateScope: DuplicateScope,
        duplicateScopeOptions: {
          deckName: string,
          checkChildren: boolean,
          checkAllModels: boolean
        }
      },
      tags: string[],
      audio: MultimediaObject[],
      video: MultimediaObject[],
      picture: MultimediaObject[]
    }
  },
  deleteDecks: {
    decks: string[],
    cardsToo: boolean
  }
}, A>

type Response<A extends RequestType> = {
  error: null | string
  result: Fetch<{
    createDeck: number,
    deckNames: string[],
    addNote: number,
    deleteDecks: null
  }, A> | null
}

type Fetch<R, K extends keyof R> = R[K]

export class AnkiService {
  private axios: Axios;
  private apiVersion: number = 6;

  public constructor() {
    this.axios = new Axios({
      baseURL: 'http://localhost:8765',
      timeout: 1000
    })
  }

  public async invoke<T extends RequestType>(action: T, params: RequestParams<T>) {
    const { data: responseData } =
      await this.axios.post('/', JSON.stringify({ action, params, version: this.apiVersion }))
    const response = JSON.parse(responseData) as Response<T>
    if (response.error != null) {
      throw new Error(response.error)
    }
    return response
  }
}