import { CharacterManager } from "#/lib/storage/characters/characterManager.ts"
import { localStorageManager } from "#/lib/storage/localStorage/localStorageManager.ts"

export const localCharacterManager = new CharacterManager(localStorageManager)
