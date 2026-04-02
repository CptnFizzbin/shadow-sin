import { z } from "zod"

import type { GameEffectData } from "#/lib/system/GameEffects/GameEffectData.ts"
import type { SourceData } from "#/lib/system/sourceData.ts"

export interface AdeptPowerData {
  id: string
  name: string
  rating: number
  costPerRating: number
  description?: string
  source?: SourceData
  effects?: GameEffectData[]
}

export const AdeptPowerDataSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  rating: z.number().int().min(1, "Rating must be at least 1"),
  costPerRating: z.number().min(0, "Cost per rating must be 0 or greater"),
  description: z.string().optional(),
  effects: z
    .object({
      type: z.string(),
      target: z.string().optional(),
      value: z.number(),
    })
    .array()
    .optional(),
}) satisfies z.ZodType<AdeptPowerData>
