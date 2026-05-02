import { milliseconds } from "date-fns"

import type { AsyncJsonStorage, AsyncStorage } from "#/lib/storage/asyncStorage.ts"
import { CachedStorage } from "#/lib/storage/cachedStorage.ts"
import { JsonStorageAdapter } from "#/lib/storage/jsonStorageAdapter.ts"
import { migrateOldLocalStorageFormat } from "#/lib/storage/migrateLocalStorage.ts"

class BrowserLocalStorage implements AsyncStorage {
  private readonly namespacePath: string

  public constructor(namespacePath = "") {
    this.namespacePath = namespacePath
  }

  private storageKey(key: string): string {
    const fullPath = this.namespacePath ? `${this.namespacePath}/${key}` : key
    return `shadowsin:${fullPath}`
  }

  public hasKey(key: string): Promise<boolean> {
    return Promise.resolve(globalThis.localStorage?.getItem(this.storageKey(key)) !== null)
  }

  public getItem(key: string): Promise<string | null> {
    return Promise.resolve(globalThis.localStorage?.getItem(this.storageKey(key)) ?? null)
  }

  public setItem(key: string, value: string): Promise<void> {
    globalThis.localStorage?.setItem(this.storageKey(key), value)
    return Promise.resolve()
  }

  public removeItem(key: string): Promise<void> {
    globalThis.localStorage?.removeItem(this.storageKey(key))
    return Promise.resolve()
  }

  public namespace(ns: string): AsyncStorage {
    const newPath = this.namespacePath ? `${this.namespacePath}/${ns}` : ns
    return new BrowserLocalStorage(newPath)
  }
}

let _storage: AsyncJsonStorage | undefined

// Wraps window.localStorage. Internally uses CachedStorage with:
//   ttl: 30 seconds
//   debounce: 5 seconds
// Returns a singleton — getStorage() always returns the same instance.
export const LocalStorageProvider = {
  getStorage(): AsyncJsonStorage {
    if (!_storage) {
      const raw = new BrowserLocalStorage()
      const cached = new CachedStorage(raw, {
        ttlMs: milliseconds({ seconds: 30 }),
        debounceMs: milliseconds({ seconds: 5 }),
      })
      _storage = new JsonStorageAdapter(cached)
      if (globalThis.localStorage) {
        migrateOldLocalStorageFormat(globalThis.localStorage)
      }
    }
    return _storage
  },
}
