import { CharacterData } from '../Character/CharacterData'
import { Gear } from './Gear'
import { Model, RecordId } from './Model'
import { User } from './User'

export interface Character extends Model {
  name: string

  user_id: RecordId
  user?: User

  gear?: Gear[]

  data?: CharacterData
}
