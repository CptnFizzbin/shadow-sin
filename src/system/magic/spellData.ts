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

export enum SpellDrainBaseType {
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
  drainBaseType: SpellDrainBaseType
  drainBaseValue?: number
  drainValueMod: number
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
  drainBaseType: z.enum(SpellDrainBaseType),
  drainBaseValue: z.number().int().min(1).optional(),
  drainValueMod: z.number().int().min(-4).max(4),
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
}).superRefine((data, ctx) => {
  if (data.drainBaseType === SpellDrainBaseType.Fixed && data.drainBaseValue === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Drain base value is required when drain base type is Fixed",
      path: ["drainBaseValue"],
    })
  }
}) satisfies z.ZodType<SpellData>
