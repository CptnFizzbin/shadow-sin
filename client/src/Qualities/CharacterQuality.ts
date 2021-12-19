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

export function toCharQuality (quality: Quality, options: QualityOptions = {}): CharacterQuality {
  const level = options.level || 1

  return {
    name: quality.getName ? quality.getName(options) : quality.name,
    level: options.level,
    cost: quality.cost ? quality.cost * level : undefined,
    bonus: quality.bonus ? quality.bonus * level : undefined,
    source: quality.source,
    gameEffect: quality.gameEffect,
    effects: quality.getEffects ? quality.getEffects(options) : [],
    notes: options.notes,
  }
}
