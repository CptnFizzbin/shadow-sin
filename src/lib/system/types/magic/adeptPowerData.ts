import { z } from "zod"

import type { SourceData } from "#/lib/system/types/sourceData.ts"

export interface AdeptPowerData {
  id: string
  name: string
  rating: number
  costPerRating: number
  totalCost?: number
  description?: string
  source?: SourceData
}

export const AdeptPowerDataSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  rating: z.number().int().min(1, "Rating must be at least 1"),
  costPerRating: z.number().min(0, "Cost per rating must be 0 or greater"),
  totalCost: z.number().min(0, "Totalcost must be 0 or greater").optional(),
  description: z.string().optional(),
  source: z
    .object({
      book: z.string().min(1, "Source book is required"),
      page: z.number().min(1, "Source page must be 1 or greater"),
    })
    .optional(),
}) satisfies z.ZodType<AdeptPowerData>
