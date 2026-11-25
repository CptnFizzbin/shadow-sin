import type { UUID } from "#/common/uuid/uuidUtils.ts"
import type { EntityKind } from "#/data/entities/entityKind.ts"
import type { GameEffectData } from "#/data/gameEffects/gameEffectData.ts"
import type { SourceData } from "#/data/source/sourceData.ts"

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
