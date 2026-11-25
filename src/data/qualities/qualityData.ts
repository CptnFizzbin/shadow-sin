import type { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { GameEffectData } from "#/system/model/gameEffects/gameEffectData.ts"
import type { SourceData } from "#/system/model/sourceData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

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
