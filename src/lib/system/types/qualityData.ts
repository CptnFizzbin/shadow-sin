import { z } from "zod"
import type { GearEffectData } from "#/lib/system/types/gearEffectData.ts"
import type { SourceData } from "#/lib/system/types/sourceData.ts"

export interface QualityData {
  id?: string
  name: string
  type: "positive" | "negative"
  bpValue?: number
  description: string
  source?: SourceData
  effects?: GearEffectData[]
  incompatibleWith?: string[]
}

export const QualityDataSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["positive", "negative"]),
  bpValue: z.number().min(0, "BP must be 0 or greater").optional(),
  description: z.string(),
  source: z
    .object({
      book: z.string(),
      page: z.number(),
    })
    .optional(),
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
