import type { DefForm } from "./def.form"
import { v4 as uuidv4 } from "uuid";
import { join, map, take } from 'ramda';

export interface Tr {
  text: string,
  pos: string,
  syn: { text: string }[],
  mean: { text: string }[],
  ex: { text: string, tr: { text: string }[] }[]
}

export interface Def {
  text: string,
  pos: string,
  ts: string,
  tr: Tr[]
}

export class DefRecord implements Def {
  public inAnki: boolean = false

  public constructor(
    public id: string,
    public historyKey: string,
    public text: string,
    public pos: string,
    public ts: string,
    public tr: Tr[]
  ) { }

  public static buildFromData(def: Def, form: DefForm): DefRecord {
    const { text, pos, ts, tr } = def
    const id = uuidv4()
    const historyKey = form.getDefKey(def)
    return new DefRecord(id, historyKey, text, pos, ts, tr)
  }

  public buildCsvRecord() {
    return [`${this.text}(${this.pos})`, join('/', map((tr: Tr) => tr.text, take(3, this.tr)))]
  }
}