import type { UUID } from "node:crypto"

import { z } from "zod"

import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import { GameEffectDataSchema } from "#/system/gameEffects/gameEffectData.ts"
import type { SourceData } from "#/system/sourceData.ts"
import { SourceDataSchema } from "#/system/sourceData.ts"

export interface QualityData {
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

export const QualityDataSchema = z.object({
  id: z.uuid() as z.ZodType<UUID>,
  name: z.string().min(1, "Name is required"),
  type: z.enum(["positive", "negative"]),
  bpValue: z.number().min(0, "BP must be 0 or greater").optional(),
  rating: z.number().int().min(1, "Rating must be at least 1").optional(),
  description: z.string().optional(),
  source: SourceDataSchema.optional(),
  effects: z.array(GameEffectDataSchema).optional(),
  incompatibleWith: z.string().array().optional(),
}) satisfies z.ZodType<QualityData>
