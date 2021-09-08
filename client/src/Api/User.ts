import { Character } from './Character'
import { Model } from './Model'

export interface User extends Model {
  name: string

  characters?: Character[]
}
