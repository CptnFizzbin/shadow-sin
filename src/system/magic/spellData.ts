import { z } from "zod"

import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import type { SourceData } from "#/system/sourceData.ts"

export enum SpellType {
  Physical = "Physical",
  Mana = "Mana",
}

export enum SpellRange {
  Touch = "Touch",
  LoS = "LoS",
  LoSArea = "LoS (A)",
}

export enum SpellDamage {
  Physical = "Physical",
  Stun = "Stun",
}

export enum SpellCategory {
  Combat = "Combat",
  Detection = "Detection",
  Health = "Health",
  Illusion = "Illusion",
  Manipulation = "Manipulation",
}

export enum SpellDuration {
  Instantaneous = "Instantaneous",
  Sustained = "Sustained",
  Permanent = "Permanent",
}

export enum SpellDrainType {
  Force = "Force",
  Fixed = "Fixed",
}

export interface SpellData {
  id: string
  name: string
  type: SpellType
  range: SpellRange
  damage: SpellDamage
  category: SpellCategory
  drain: {
    type: SpellDrainType
    value: number
  }
  dealsDamage: boolean
  duration: SpellDuration
  threshold?: string
  voluntaryTargetsOnly: boolean
  description?: string
  source?: SourceData
  effects?: GameEffectData[]
  sustained?: boolean
}

export const SpellDataSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(SpellType),
  range: z.enum(SpellRange),
  damage: z.enum(SpellDamage),
  category: z.enum(SpellCategory),
  drain: z.object({
    type: z.enum(SpellDrainType),
    value: z.number().int(),
  }),
  dealsDamage: z.boolean(),
  duration: z.enum(SpellDuration),
  threshold: z.string().optional(),
  voluntaryTargetsOnly: z.boolean(),
  description: z.string().optional(),
  source: z
    .object({
      book: z.string().min(1, "Source book is required"),
      page: z.number().min(1, "Source page must be 1 or greater"),
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
  sustained: z.boolean().optional(),
}) satisfies z.ZodType<SpellData>
