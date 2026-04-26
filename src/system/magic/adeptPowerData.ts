import { z } from "zod"

import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import { GameEffectDataSchema } from "#/system/gameEffects/gameEffectData.ts"
import type { SourceData } from "#/system/sourceData.ts"
import { SourceDataSchema } from "#/system/sourceData.ts"

/**
 * Represents an adept power and its associated game effects.
 */
export interface AdeptPowerData {
  id: string
  name: string
  rating: number
  costPerRating: number
  description?: string
  source?: SourceData
  effects?: GameEffectData[]
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
