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
    "participle",
    "any",
  ];
  public partOfSpeech: string = "any";

  public getFormKeys() {
    const partsOfSpeech = this.partOfSpeech == "any" ? [
      "noun",
      "adjective",
      "verb",
      "adverb",
      "participle"
    ] : [this.partOfSpeech]
    return partsOfSpeech.map(partOfSpeech => [
      this.sourceLang,
      this.targetLang,
      this.phrase,
      partOfSpeech,
    ].join("-"));
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
