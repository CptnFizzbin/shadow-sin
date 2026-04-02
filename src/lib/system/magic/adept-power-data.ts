import { z } from "zod"

import type { SourceData } from "#/lib/system/source-data.ts"

export interface AdeptPowerData {
  id: string
  name: string
  rating: number
  costPerRating: number
  description?: string
  source?: SourceData
}

export const AdeptPowerDataSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  rating: z.number().int().min(1, "Rating must be at least 1"),
  costPerRating: z.number().min(0, "Cost per rating must be 0 or greater"),
  description: z.string().optional(),
}) satisfies z.ZodType<AdeptPowerData>
