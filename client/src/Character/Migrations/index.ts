import { CharacterData } from '../CharacterData'
import { InitialMigration } from './1-Inital'
import { BioMigration } from './2-Bio'
import { BalanceLogsMigration } from './3-BalanceLog'

export interface Migration {
  version: number

  run (data: SavedCharacterData): SavedCharacterData
}

export interface SavedCharacterData {
  dataVersion: number

  [key: string]: unknown
}

export const migrateCharacter = (character: SavedCharacterData | CharacterData): CharacterData => {
  for (const migration of migrations) {
    if (character.dataVersion >= migration.version) continue
    character = migration.run(character as SavedCharacterData)
    character.dataVersion = migration.version
  }

  return character as unknown as CharacterData
}

const migrations: Migration[] = [
  InitialMigration,
  BioMigration,
  BalanceLogsMigration,
].sort((a, b) => a.version - b.version)
