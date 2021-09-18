import { RecordId } from './Api/Model'
import { CharacterData } from './Character/CharacterData'
import { migrateCharacter, SavedCharacterData } from './Character/Migrations'
import { Artemis } from './data/Artemis'
import { Silicus } from './data/Silicus'

const characterStorageKey = (characterId: string) => `character.${characterId}`
const charactersStorageKey = 'characters'
const DEBUG_LOAD = true

export interface SavedCharacter {
  id: RecordId
  name: string
  metaType: string
}

export function loadCharacters (): SavedCharacter[] {
  if (DEBUG_LOAD || !localStorage.getItem(charactersStorageKey)) {
    const characters = [
      migrateCharacter(Artemis),
      migrateCharacter(Silicus),
    ]

    characters.forEach(character => saveCharacter(character))
    localStorage.setItem(charactersStorageKey, JSON.stringify(
      characters.map(character => ({
        id: character.id,
        name: character.bio.alias || character.bio.name,
        metaType: character.bio.metaType,
      })),
    ))
  }

  return JSON.parse(localStorage.getItem(charactersStorageKey) || '[]')
}

export function saveCharacter (character: CharacterData): void {
  if (character.id == null) throw new Error('Character has no id')
  localStorage.setItem(characterStorageKey(character.id), JSON.stringify(character))
}

export function loadCharacter (characterId: string): CharacterData | null {
  const character: SavedCharacterData = JSON.parse(localStorage.getItem(characterStorageKey(characterId)) || 'null')
  if (character) return migrateCharacter(character)
  return null
}
