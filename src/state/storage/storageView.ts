import type { AsyncStorage } from "./asyncStorage.ts"

export class StorageView implements AsyncStorage {
  public constructor(
    private readonly root: AsyncStorage,
    private readonly prefix: string,
  ) {}

  private fullKey(key: string): string {
    return `${this.prefix}/${key}`
  }

  public hasKey(key: string): Promise<boolean> {
    return this.root.hasKey(this.fullKey(key))
  }

  public getItem(key: string): Promise<string | null> {
    return this.root.getItem(this.fullKey(key))
  }

  public setItem(key: string, value: string): Promise<void> {
    return this.root.setItem(this.fullKey(key), value)
  }

  public removeItem(key: string): Promise<void> {
    return this.root.removeItem(this.fullKey(key))
  }

  public namespace(ns: string): StorageView {
    return new StorageView(this.root, this.fullKey(ns))
  }
}
