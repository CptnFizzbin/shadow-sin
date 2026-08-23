import { z } from "zod"

import { EntityKind } from "#/system/entityKind.ts"
import { GameEffectDataSchema } from "#/system/gameEffects/gameEffectData.ts"
import type { QualityData } from "#/system/qualityData.ts"
import { SourceDataSchema } from "#/system/sourceData.ts"

const QualityDataSchema = z.object({
  kind: z.literal(EntityKind.quality),
  id: z.uuid(),
  name: z.string(),
  type: z.enum(["positive", "negative"]),
  bpValue: z.number().optional(),
  rating: z.number().optional(),
  description: z.string().optional(),
  source: SourceDataSchema.optional(),
  effects: GameEffectDataSchema.array().optional(),
  incompatibleWith: z.string().array().optional(),
}) satisfies z.ZodType<QualityData>

/** An Entity with a list of Qualities. Implemented by `RunnerData`; consumed by `DamageSelectors`
 *  for High/Low Pain Tolerance effects. */
export interface EntityWithQualities {
  qualities: QualityData[]
}

export const EntityWithQualitiesSchema = z.object({
  qualities: QualityDataSchema.array(),
}) satisfies z.ZodType<EntityWithQualities>

export const isEntityWithQualities = (obj: object): obj is EntityWithQualities => {
  return EntityWithQualitiesSchema.safeParse(obj).success
}
