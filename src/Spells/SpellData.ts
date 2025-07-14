import {Source} from '../System/Source'
import {DicePoolData} from '../UI/DicePool'
import {SpellCategory} from './SpellCategory'
import {SpellType} from './SpellType'

export interface SpellDataBase {
  id: string
  source?: Source
  name: string
  category: SpellCategory
  range: string
  type: SpellType
  duration: string
  drainValue: number
  effect?: string
  castingPool?: DicePoolData
}

export interface CombatSpellData extends SpellDataBase {
  category: SpellCategory.Combat
  damageType: 'Indirect' | 'Direct'
  area?: boolean
  damage: string
}

export interface DetectionSpellData extends SpellDataBase {
  category: SpellCategory.Detection
}

export interface HealthSpellData extends SpellDataBase {
  category: SpellCategory.Health
}

export interface IllusionSpellData extends SpellDataBase {
  category: SpellCategory.Illusion
  senseType: 'Multi-Sense' | 'Single-Sense'
}

export interface ManipulationSpellData extends SpellDataBase {
  category: SpellCategory.Manipulation
}

export type SpellData =
  | CombatSpellData
  | DetectionSpellData
  | HealthSpellData
  | IllusionSpellData
  | ManipulationSpellData
