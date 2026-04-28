import { CharacterManager } from "#/character/characterManager.ts"

import { localStorageManager } from "./localStorageManager.ts"

export const localCharacterManager = new CharacterManager(localStorageManager)
