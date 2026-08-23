import type { UUID } from "#/lib/uuidUtils.ts"

import type { EntityKind } from "./entityKind.ts"
import type { GameEffectData } from "./gameEffects/gameEffectData.ts"
import type { SourceData } from "./sourceData.ts"

/**
 * Represents a quality (positive or negative) that a runner can possess.
 */
export interface QualityData {
  kind: EntityKind.quality
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
