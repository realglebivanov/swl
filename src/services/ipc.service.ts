import type { SaveDialogOptions, MessageBoxOptions, SaveDialogReturnValue } from "electron"

export class IPCService {
  public showMessageBox(opts: MessageBoxOptions) {
    return this.invoke({ type: "showMessageBox", opts })
  }

  public showSaveDialog(opts: SaveDialogOptions): Promise<SaveDialogReturnValue> {
    return this.invoke({ type: "showSaveDialog", opts })
  }

  public writeFile(path: string, content: string, encoding: string) {
    return this.invoke({ type: "writeFile", opts: { path, content, encoding } })
  }

  public invoke<A, B>({ type, opts }: { type: string, opts: A }): Promise<B> {
    return window.ipcRenderer.invoke(type, opts)
  }
}