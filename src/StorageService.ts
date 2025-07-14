import { nextRecordId } from "./Api/Model"
import { Character } from "./Character/Character"
import { migrateCharacter, SavedCharacter } from "./Character/Migrations"
import { Artemis } from "./data/Characters/Artemis"
import { Dusk } from "./data/Characters/Dusk"
import { Silicus } from "./data/Characters/Silicus"
import { Spike } from "./data/Characters/Spike"
import { Xendris } from "./data/Characters/Xendris"

const characterStorageKey = (characterId: string) => `character.${characterId}`
const charactersStorageKey = "characters"
const DEBUG_LOAD = true

export type SavedCharacters = Record<string, string>

export function loadCharacters(): SavedCharacters {
  if (DEBUG_LOAD || !localStorage.getItem(charactersStorageKey)) {
    const savedCharacters: SavedCharacters = {}

    const characters: Character[] = [Artemis, Silicus, Xendris, Spike, Dusk]
      .map(
        (data) =>
          ({
            name: data.bio.alias || data.bio.name,
            id: data.bio.alias || data.bio.name,
            userId: "affbd8b8-8c41-4e82-86b6-85d184a71318",
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            data,
          }) as Character,
      )
      .map((character) => migrateCharacter(character))

    characters.forEach((character) => {
      if (character.id === null) character.id = nextRecordId()
      saveCharacter(character)
      savedCharacters[character.id] = character.name
    })

    localStorage.setItem(charactersStorageKey, JSON.stringify(savedCharacters))
  }

  return JSON.parse(localStorage.getItem(charactersStorageKey) || "{}")
}

export function saveCharacter(character: Character): void {
  if (character.id == null) throw new Error("Character has no id")
  localStorage.setItem(
    characterStorageKey(character.id),
    JSON.stringify(character),
  )
}

export function loadCharacter(characterId: string): Character | null {
  const character: SavedCharacter = JSON.parse(
    localStorage.getItem(characterStorageKey(characterId)) || "null",
  )
  if (character) return migrateCharacter(character)
  return null
}
