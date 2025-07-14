import { IsoDateString, Model, RecordId } from "../Api/Model"
import { CharacterData } from "./CharacterData"

export interface Character extends Model {
  name: string
  userId: RecordId
  data: CharacterData
}

export interface SimpleCharacter extends Model {
  name: string
  userId: RecordId
  updatedAt: IsoDateString
}
