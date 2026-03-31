import { z } from "zod"

import type { SourceData } from "#/lib/system/sourceData.ts"

export type SpellType = "Physical" | "Mana"
export type SpellRange = "Touch" | "LoS" | "LoS (A)"
export type SpellDamage = "Physical" | "Stun"
export type SpellCategory = "Combat" | "Detection" | "Health" | "Illusion" | "Manipulation"
export type SpellDuration = "Instantaneous" | "Sustained" | "Permanent"

export interface SpellData {
  id: string
  name: string
  type: SpellType
  range: SpellRange
  damage: SpellDamage
  category: SpellCategory
  drainValueMod: number
  dealsDamage: boolean
  duration: SpellDuration
  threshold?: string
  voluntaryTargetsOnly: boolean
  description?: string
  source?: SourceData
}

export const SpellDataSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["Physical", "Mana"]),
  range: z.enum(["Touch", "LoS", "LoS (A)"]),
  damage: z.enum(["Physical", "Stun"]),
  category: z.enum(["Combat", "Detection", "Health", "Illusion", "Manipulation"]),
  drainValueMod: z.number().int().min(-4).max(4),
  dealsDamage: z.boolean(),
  duration: z.enum(["Instantaneous", "Sustained", "Permanent"]),
  threshold: z.string().optional(),
  voluntaryTargetsOnly: z.boolean(),
  description: z.string().optional(),
  source: z
    .object({
      book: z.string().min(1, "Source book is required"),
      page: z.number().min(1, "Source page must be 1 or greater"),
    })
    .optional(),
}) satisfies z.ZodType<SpellData>
