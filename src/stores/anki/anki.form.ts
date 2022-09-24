export class AnkiForm {
  public ankiDeck: string = '';
  public newAnkiDeck: string = '';

  public noDeckSelected() {
    return this.ankiDeck == ''
  }
}