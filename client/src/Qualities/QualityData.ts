import { useCharacterData } from '../Character/CharacterProvider'
import { Effect } from '../System/Effect'
import { Source } from '../System/Source'

export interface QualityData {
  name: string
  source?: Source
  description?: string
  gameEffect?: string
  effects?: Effect[]
  cost?: number
  bonus?: number
  level?: number
}

export const useQualities = (): QualityData[] => {
  const character = useCharacterData()
  if (!character) return []
  return character.qualities
}
