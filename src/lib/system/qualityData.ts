import { z } from "zod"

import type { GearEffectData } from "#/lib/system/gearEffectData.ts"
import type { SourceData } from "#/lib/system/sourceData.ts"

export interface QualityData {
  id: string
  name: string
  type: "positive" | "negative"
  bpValue?: number
  rating?: number
  description?: string
  source?: SourceData
  effects?: GearEffectData[]
  incompatibleWith?: string[]
}

export const QualityDataSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["positive", "negative"]),
  bpValue: z.number().min(0, "BP must be 0 or greater").optional(),
  rating: z.number().int().min(1, "Rating must be at least 1").optional(),
  description: z.string().optional(),
  effects: z
    .object({
      type: z.string(),
      target: z.string().optional(),
      value: z.number(),
    })
    .array()
    .optional(),
  incompatibleWith: z.string().array().optional(),
}) satisfies z.ZodType<QualityData>
