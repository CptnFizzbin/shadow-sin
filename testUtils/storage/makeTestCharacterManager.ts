import { LocalStorageProvider } from "#/lib/storage/localStorage/localStorageProvider.ts"
import { StorageManager } from "#/lib/storage/storageManager.ts"
import { CharacterManager } from "#/character/characterManager.ts"

import { MemoryStorage } from "./memoryStorage.ts"

export interface TestCharacterManagerResult {
  manager: CharacterManager
  provider: LocalStorageProvider
  storage: MemoryStorage
}

/**
 * Creates an isolated CharacterManager backed by fresh in-memory storage.
 * Returns the manager, the provider (for seeding raw fixture files via
 * `saveJsonFile`), and the underlying MemoryStorage (for direct inspection
 * of what was persisted, bypassing the manager's in-memory cache).
 */
export function makeTestCharacterManager(): TestCharacterManagerResult {
  const storage = new MemoryStorage()
  const provider = new LocalStorageProvider({ storagePrefix: "test" })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(provider as any).getStorage = () => storage
  const manager = new CharacterManager(new StorageManager(provider), { saveDebounceWait: 0 })
  return { manager, provider, storage }
}
