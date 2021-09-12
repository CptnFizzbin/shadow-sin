import { Source } from '../System/Source'

export interface QualityData {
  name: string
  source?: Source
  description?: string
  gameEffect?: string
  cost?: number
  bonus?: number
  level?: number
}
