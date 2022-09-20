export interface Tr {
  text: string,
  pos: string,
  syn: { text: string }[],
  mean: { text: string }[],
  ex: { text: string, tr: { text: string }[] }[]
}

export interface Def {
  id: string,
  historyKey: string,
  text: string,
  pos: string,
  ts: string,
  tr: Tr[]
}