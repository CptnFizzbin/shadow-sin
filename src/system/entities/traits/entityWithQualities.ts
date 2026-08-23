import { z } from "zod"

import type { UUID } from "#/lib/uuidUtils.ts"
import { EntityKind } from "#/system/entityKind.ts"
import { GameEffectDataSchema } from "#/system/gameEffects/gameEffectData.ts"
import type { QualityData } from "#/system/qualityData.ts"
import { SourceDataSchema } from "#/system/sourceData.ts"

const QualityDataSchema = z.object({
  kind: z.literal(EntityKind.quality),
  id: z.uuid() as z.ZodType<UUID>,
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
 *  for High/Low Pain Tolerance effects. Deliberately standalone rather than `extends EntityBase`
 *  — not every Entity kind a capability trait like this could apply to (e.g. Spirit/Sprite, which
 *  have no `source` field and don't use `EntityBase.rating`) structurally satisfies
 *  `EntityBase`'s full shape. See `EntityProvider`'s doc comment for the same call. */
export interface EntityWithQualities {
  qualities: QualityData[]
}

export const EntityWithQualitiesSchema = z.object({
  qualities: QualityDataSchema.array(),
}) satisfies z.ZodType<EntityWithQualities>

export const isEntityWithQualities = (obj: object): obj is EntityWithQualities => {
  return EntityWithQualitiesSchema.safeParse(obj).success
}
