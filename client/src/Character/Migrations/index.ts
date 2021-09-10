import { CharacterData } from '../CharacterData'

export interface Migration {
  version: number

  run (data: CharacterData): CharacterData
}

const migrations: Migration[] = []

export const migrateCharacter = (character: CharacterData): CharacterData => {
  for (const migration of migrations) {
    if (character.dataVersion >= migration.version) continue
    character = migration.run(character)
    character.dataVersion = migration.version
  }

  return character
}
