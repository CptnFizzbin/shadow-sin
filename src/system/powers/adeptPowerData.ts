import { z } from "zod"

import { EntityKind } from "#/system/entityKind.ts"
import { GameEffectDataSchema } from "#/system/gameEffects/gameEffectData.ts"
import type { Rating } from "#/system/rating.ts"
import { SourceDataSchema } from "#/system/sourceData.ts"

import type { PowerData } from "./powerData.ts"

/**
 * Represents an adept power and its associated game effects.
 * Cost is measured in Magic points per rating.
 */
export interface AdeptPowerData extends PowerData {
  kind: EntityKind.adeptPower
  type: "adeptPower"
  /** Plain `number` in practice — Adept Powers have no sentinel case — typed as `Rating` for consistency with the rest of the Entity system. */
  rating: Rating
  costPerRating: number
}

/**
 * Zod schema for validating AdeptPowerData.
 */
export const AdeptPowerDataSchema = z.object({
  kind: z.literal(EntityKind.adeptPower),
  type: z.literal("adeptPower"),
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  rating: z.number().int().min(1, "Rating must be at least 1"),
  costPerRating: z.number().min(0, "Cost per rating must be 0 or greater"),
  description: z.string().optional(),
  source: SourceDataSchema.optional(),
  effects: z.array(GameEffectDataSchema).optional(),
}) satisfies z.ZodType<AdeptPowerData>
