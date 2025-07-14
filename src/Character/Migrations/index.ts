import { RecordId } from "../../Api/Model"
import { Character } from "../Character"
import { InitialMigration } from "./1-Inital"

export interface Migration {
  version: number

  run(data: SavedCharacter): SavedCharacter
}

export interface SavedCharacter {
  name: string
  id: RecordId

  data: {
    dataVersion: number
    [key: string]: unknown
  }
}

export const migrateCharacter = (
  character: Character | SavedCharacter,
): Character => {
  for (const migration of migrations) {
    if (character.data.dataVersion >= migration.version) continue
    character = migration.run(character as SavedCharacter)
    character.data.dataVersion = migration.version
  }

  return character as Character
}

const migrations: Migration[] = [InitialMigration].sort(
  (a, b) => a.version - b.version,
)
