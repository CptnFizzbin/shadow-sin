import { CharacterData } from '../Character/CharacterData'
import { Model, RecordId } from './Model'

export interface Character extends Model {
  name: string

  user_id: RecordId

  data: CharacterData
}
