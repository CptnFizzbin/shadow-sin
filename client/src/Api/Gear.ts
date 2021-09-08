import { GearData } from '../Gear/GearData'
import { Character } from './Character'
import { Model, RecordId } from './Model'

export interface Gear extends Model {
  name: string

  character_id: RecordId
  character?: Character

  parent_id: RecordId
  parent?: Gear

  nested_gear?: Gear[]

  data?: GearData
}
