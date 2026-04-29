import type { UUID } from "node:crypto"

import type { GameEffectData } from "./gameEffects/gameEffectData.ts"
import type { SourceData } from "./sourceData.ts"

/**
 * Represents a quality (positive or negative) that a character can possess.
 */
export interface QualityData {
  id: UUID
  name: string
  type: "positive" | "negative"
  bpValue?: number
  rating?: number
  description?: string
  source?: SourceData
  effects?: GameEffectData[]
  incompatibleWith?: string[]
}
