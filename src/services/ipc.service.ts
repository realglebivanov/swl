import type { SaveDialogOptions, SaveDialogReturnValue } from "electron"

export class IPCService {
  public showSaveDialog(opts: SaveDialogOptions): Promise<SaveDialogReturnValue> {
    return this.invoke({ type: "showSaveDialog", opts: opts })
  }

  public writeFile(path: string, content: string, encoding: string) {
    return this.invoke({ type: "writeFile", opts: { path, content, encoding } })
  }

  public invoke<A, B>({ type, opts }: { type: string, opts: A }): Promise<B> {
    return window.ipcRenderer.invoke(type, opts)
  }
}