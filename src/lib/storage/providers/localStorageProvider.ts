import { milliseconds } from "date-fns"

import type { AsyncJsonStorage, AsyncStorage, JsonValue } from "#/lib/storage/asyncStorage.ts"
import { CachedStorage } from "#/lib/storage/cachedStorage.ts"
import { JsonStorageAdapter } from "#/lib/storage/jsonStorageAdapter.ts"

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

// Migrate characters stored by the old storage layer (pre-refactor) to the new key format.
//
// Old character key:   shadow-sin:json:characters/${id}.json
// Old character value: { path: string, updatedAt: string, value: CharacterData }
//
// New character key:   shadowsin:characters/${id}
// New character value: CharacterData (direct JSON)
//
// Old builder key:   shadow-sin:character-form:${id}
// Old builder value: BuilderRootState (direct JSON)
//
// New builder key:   shadowsin:builder/character-form/${id}
// New builder value: BuilderRootState (direct JSON)
function migrateOldStorageFormat(): void {
  const ls = globalThis.localStorage
  if (!ls) return

  const oldCharacterPrefix = "shadow-sin:json:characters/"
  const oldCharacterSuffix = ".json"
  const oldBuilderPrefix = "shadow-sin:character-form:"

  const keysToRemove: string[] = []
  const migrations: Array<{ newKey: string, value: string }> = []

  for (let i = 0; i < ls.length; i++) {
    const rawKey = ls.key(i)
    if (!rawKey) continue

    if (rawKey.startsWith(oldCharacterPrefix) && rawKey.endsWith(oldCharacterSuffix)) {
      const withoutPrefix = rawKey.slice(oldCharacterPrefix.length)
      const characterId = withoutPrefix.slice(0, -oldCharacterSuffix.length)
      const raw = ls.getItem(rawKey)
      if (!raw) continue

      try {
        const envelope = JSON.parse(raw) as { value?: JsonValue }
        const characterData = envelope.value ?? envelope
        migrations.push({ newKey: `shadowsin:characters/${characterId}`, value: JSON.stringify(characterData) })
        keysToRemove.push(rawKey)
      } catch {
        // Unparseable — skip, don't lose data by removing
      }
    } else if (rawKey.startsWith(oldBuilderPrefix)) {
      const characterId = rawKey.slice(oldBuilderPrefix.length)
      const raw = ls.getItem(rawKey)
      if (!raw) continue
      migrations.push({ newKey: `shadowsin:builder/character-form/${characterId}`, value: raw })
      keysToRemove.push(rawKey)
    }
  }

  for (const { newKey, value } of migrations) {
    if (!ls.getItem(newKey)) {
      ls.setItem(newKey, value)
    }
  }

  // Build / update the index from migrated characters
  if (migrations.some((m) => m.newKey.startsWith("shadowsin:characters/"))) {
    const indexKey = "shadowsin:index"
    let index: Array<{ id: string, name: string, lastModified: string }> = []
    const existing = ls.getItem(indexKey)
    if (existing) {
      try {
        index = JSON.parse(existing) as typeof index
      } catch {
        index = []
      }
    }

    const indexedIds = new Set(index.map((e) => e.id))

    for (const { newKey } of migrations) {
      if (!newKey.startsWith("shadowsin:characters/")) continue
      const characterId = newKey.slice("shadowsin:characters/".length)
      if (indexedIds.has(characterId)) continue

      try {
        const raw = ls.getItem(newKey)
        if (!raw) continue
        const data = JSON.parse(raw) as Record<string, unknown>
        const alias =
          typeof data["profile"] === "object" && data["profile"] !== null
            ? String((data["profile"] as Record<string, unknown>)["alias"] ?? characterId)
            : characterId
        index.push({ id: characterId, name: alias, lastModified: new Date().toISOString() })
        indexedIds.add(characterId)
      } catch {
        // Skip characters we can't parse for the index
      }
    }

    ls.setItem(indexKey, JSON.stringify(index))
  }

  for (const key of keysToRemove) {
    ls.removeItem(key)
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
      migrateOldStorageFormat()
    }
    return _storage
  },
}
