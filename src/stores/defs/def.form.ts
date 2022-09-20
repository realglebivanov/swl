import type { Def } from "./def";

export class DefForm {
  public sourceLang: string = "en";
  public targetLang: string = "ru";
  public phrase: string = "";
  public partsOfSpeech: string[] = [
    "noun",
    "adjective",
    "verb",
    "adverb",
    "any",
  ];
  public partOfSpeech: string = "any";


  public getFormKey() {
    return [
      this.sourceLang,
      this.targetLang,
      this.phrase,
      this.partOfSpeech,
    ].join("-");
  }

  public getDefKey(def: Def) {
    return [
      this.sourceLang,
      this.targetLang,
      this.phrase,
      def.pos,
    ].join("-");
  }
}
