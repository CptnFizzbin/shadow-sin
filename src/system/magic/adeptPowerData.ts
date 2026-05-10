import { z } from "zod"

import { GameEffectDataSchema } from "#/system/gameEffects/gameEffectData.ts"
import { SourceDataSchema } from "#/system/sourceData.ts"

import type { PowerData } from "./powerData.ts"

/**
 * Represents an adept power and its associated game effects.
 * Cost is measured in Magic points per rating.
 */
export interface AdeptPowerData extends PowerData {
  rating: number
  costPerRating: number
}

/**
 * Zod schema for validating AdeptPowerData.
 */
export const AdeptPowerDataSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  rating: z.number().int().min(1, "Rating must be at least 1"),
  costPerRating: z.number().min(0, "Cost per rating must be 0 or greater"),
  description: z.string().optional(),
  source: SourceDataSchema.optional(),
  effects: z.array(GameEffectDataSchema).optional(),
}) satisfies z.ZodType<AdeptPowerData>
