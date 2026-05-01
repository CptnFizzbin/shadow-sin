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
 * Creates a CharacterManager backed by in-memory storage, suitable for unit tests.
 * Returns the manager, provider (for writing raw fixture files), and the underlying
 * MemoryStorage instance (for sharing between multiple managers in debounce tests).
 *
 * Pass an existing `storage` to have two managers share the same underlying store.
 */
export function makeTestCharacterManager(
  storage: MemoryStorage = new MemoryStorage(),
): TestCharacterManagerResult {
  const provider = new LocalStorageProvider({ storagePrefix: "test" })
  // LocalStorageProvider.getStorage is private; Object.defineProperty overrides it
  // without a type cast so the compile-time signature remains intact.
  Object.defineProperty(provider, "getStorage", { value: () => storage, writable: true, configurable: true })
  const manager = new CharacterManager(new StorageManager(provider), { saveDebounceWait: 0 })
  return { manager, provider, storage }
}
