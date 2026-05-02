import type { AsyncStorage, AsyncJsonStorage, JsonStorageProvider } from "#/lib/storage/asyncStorage.ts"
import { toJsonStorage } from "#/lib/storage/asyncStorage.ts"

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

// Stores everything in a Map<string, string>. No CachedStorage wrapper needed.
// Use in unit tests and anywhere no persistence is required.
// getStorage() returns a fresh instance each call (for test isolation).
export const MemoryStorageProvider: JsonStorageProvider = {
  getStorage(): AsyncJsonStorage {
    return toJsonStorage(new MemoryAsyncStorage())
  },
}
