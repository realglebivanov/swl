export class AppForm {
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

  public getKey() {
    return [
      this.sourceLang,
      this.targetLang,
      this.phrase,
      this.partsOfSpeech,
    ].join("/");
  }
}