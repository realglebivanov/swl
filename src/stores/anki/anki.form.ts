import type { ModelName } from '@/services/anki.service'
import { ankiService } from '@/services'

export class AnkiForm {
  public ankiDeck: string = '';
  public ankiModel: ModelName = "swl-reversed-card";
  public newAnkiDeck: string = '';

  public noDeckSelected() {
    return this.ankiDeck == ''
  }

  public getDefaultModelNames() {
    return ankiService.getDefaultModelNames().map((modelName: ModelName) => {
      switch (modelName) {
        case "swl-basic":
          return { value: modelName, description: "One-sided cards" }
        case "swl-reversed-card":
          return { value: modelName, description: "Two-sided cards" }
        default:
          throw new Error("Unsupported default model name")
      }
    })
  }
}