import { Migration, SavedCharacterData } from './index'

interface InputData extends SavedCharacterData {
  name: string
  metaType: string
  alias?: string
  ethnicity?: string
  age?: number
  gender?: string
  height?: string
  weight?: string
}

interface OutputData extends SavedCharacterData {
  bio: BioData
}

interface BioData {
  name: string
  metaType: string
  alias?: string
  ethnicity?: string
  age?: number
  gender?: string
  height?: string
  weight?: string
}

export const BioMigration: Migration = {
  version: 2,

  run: (character: InputData): OutputData => {
    const bio: BioData = {
      name: character.name,
      alias: character.alias,
      metaType: character.metaType,
      ethnicity: character.ethnicity,

      age: character.age,
      gender: character.gender,
      height: character.height,
      weight: character.weight,
    }

    const updated: OutputData = { ...character, bio }
    delete updated.name
    delete updated.alias
    delete updated.metaType
    delete updated.ethnicity
    delete updated.age
    delete updated.gender
    delete updated.height
    delete updated.weight

    return updated
  },
}
