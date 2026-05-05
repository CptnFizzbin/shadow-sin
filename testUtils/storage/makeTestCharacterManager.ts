import type { AsyncJsonStorage } from "#/lib/storage/asyncStorage.ts"
import { createMemoryStorage } from "#/lib/storage/providers/memoryStorageProvider.ts"
import { CharacterManager } from "#/character/characterManager.ts"

export function makeTestCharacterManager(): {
  manager: CharacterManager
  storage: AsyncJsonStorage
} {
  const storage = createMemoryStorage()
  const manager = new CharacterManager({ local: storage })
  return { manager, storage }
}
