import { useCharacterData } from '../Character/CharacterProvider'
import { Qualities as CrbQualities, QualityIds as CrbQualityIds } from '../data/Rulebooks/CRB'
import { Effect } from '../System/Effect'
import { Source } from '../System/Source'
import { CharacterQuality } from './CharacterQuality'

export type QualityId = string

export interface Quality {
  id: QualityId
  name: string
  cost?: number
  bonus?: number
  source: Source
  gameEffect?: string

  options?: QualityOptionFlags
  maxLevel?: number

  getName? (options: QualityOptions): string

  getEffects? (options: QualityOptions): Effect[]
}

export type QualityOptions = {
  level?: number
  type?: string
  notes?: string
  metaType?: boolean
}

export type QualityOptionFlags = {
  [option in keyof QualityOptions]?: boolean;
}

export const QualityIds = {
  CRB: CrbQualityIds,
}

export const Qualities: Record<QualityId, Quality> = {}
export const getQuality = (qualityId: QualityId): Quality => Qualities[qualityId]
const registerQuality = (quality: Quality) => Qualities[quality.id] = quality

CrbQualities.forEach(registerQuality)

export const useQualities = (): CharacterQuality[] => {
  const character = useCharacterData()
  if (!character) return []
  return character.qualities
}
