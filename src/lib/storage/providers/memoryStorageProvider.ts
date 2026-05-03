import type { AsyncJsonStorage, AsyncStorage } from "#/lib/storage/asyncStorage.ts"
import { JsonStorageAdapter } from "#/lib/storage/jsonStorageAdapter.ts"

class MemoryAsyncStorage implements AsyncStorage {
  private readonly map: Map<string, string>
  private readonly namespacePath: string

  public constructor(map?: Map<string, string>, namespacePath?: string) {
    this.map = map ?? new Map()
    this.namespacePath = namespacePath ?? ""
  }

  private fullKey(key: string): string {
    return this.namespacePath ? `${this.namespacePath}/${key}` : key
  }

  public hasKey(key: string): Promise<boolean> {
    return Promise.resolve(this.map.has(this.fullKey(key)))
  }

  public getItem(key: string): Promise<string | null> {
    return Promise.resolve(this.map.get(this.fullKey(key)) ?? null)
  }

  public setItem(key: string, value: string): Promise<void> {
    this.map.set(this.fullKey(key), value)
    return Promise.resolve()
  }

  public removeItem(key: string): Promise<void> {
    this.map.delete(this.fullKey(key))
    return Promise.resolve()
  }

  public namespace(ns: string): AsyncStorage {
    const newPath = this.namespacePath ? `${this.namespacePath}/${ns}` : ns
    return new MemoryAsyncStorage(this.map, newPath)
  }
}

export function createMemoryStorage(): AsyncJsonStorage {
  return new JsonStorageAdapter(new MemoryAsyncStorage())
}
