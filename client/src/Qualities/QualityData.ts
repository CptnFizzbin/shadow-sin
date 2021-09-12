import { Source } from '../System/Source'

interface BaseQualityData {
  name: string
  source?: Source
  description?: string
  gameEffect?: string
  type: string
  cost?: unknown
  bonus?: unknown
  level?: number
}

export interface PositiveQuality extends BaseQualityData {
  type: 'positive'
  cost: number
}

export interface NegativeQuality extends BaseQualityData {
  type: 'negative'
  bonus: number
}

export type QualityData =
  | PositiveQuality
  | NegativeQuality
