import { CharacterManager } from "#/lib/storage/characters/character-manager.ts"
import { localStorageManager } from "#/lib/storage/local-storage/local-storage-manager.ts"

export const localCharacterManager = new CharacterManager(localStorageManager)
