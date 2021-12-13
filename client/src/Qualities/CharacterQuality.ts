import { Effect } from '../System/Effect'
import { Source } from '../System/Source'
import { Quality, QualityOptions } from './Quality'

export interface CharacterQuality {
  name: string
  level?: number
  cost?: number
  bonus?: number
  source?: Source
  gameEffect?: string
  effects?: Effect[]
  notes?: string
}

export function toCharQuality (quality: Quality, options: QualityOptions): CharacterQuality {
  return {
    name: quality.getName ? quality.getName(options) : quality.name,
    level: options.level,
    cost: quality.cost,
    bonus: quality.bonus,
    source: quality.source,
    gameEffect: quality.gameEffect,
    effects: quality.getEffects ? quality.getEffects(options) : [],
  }
}
