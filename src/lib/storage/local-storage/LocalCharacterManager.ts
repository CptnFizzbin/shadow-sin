import { CharacterManager } from "#/lib/storage/characters/CharacterManager.ts"
import { localStorageManager } from "#/lib/storage/local-storage/LocalStorageManager.ts"

export const localCharacterManager = new CharacterManager(localStorageManager)
