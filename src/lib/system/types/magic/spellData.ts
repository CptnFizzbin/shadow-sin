import { z } from "zod"

import type { SourceData } from "#/lib/system/types/sourceData.ts"

export type SpellType = "Physical" | "Mana"
export type SpellRange = "Touch" | "LoS" | "LoS (A)"
export type SpellDamage = "Physical" | "Stun"

export interface SpellData {
  id: string
  name: string
  type: SpellType
  range: SpellRange
  damage: SpellDamage
  description?: string
  source?: SourceData
}

export const SpellDataSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["Physical", "Mana"]),
  range: z.enum(["Touch", "LoS", "LoS (A)"]),
  damage: z.enum(["Physical", "Stun"]),
  description: z.string().optional(),
  source: z
    .object({
      book: z.string().min(1, "Source book is required"),
      page: z.number().min(1, "Source page must be 1 or greater"),
    })
    .optional(),
}) satisfies z.ZodType<SpellData>
