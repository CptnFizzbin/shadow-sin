import { z } from "zod"

import type { GameEffectData } from '#/lib/system/game-effects/game-effect-data.ts"
import type { SourceData } from "#/lib/system/sourceData.ts"

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
  effects?: GameEffectData[]
}

export const SpellDataSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(SpellType),
  range: z.nativeEnum(SpellRange),
  damage: z.nativeEnum(SpellDamage),
  category: z.nativeEnum(SpellCategory),
  drainValueMod: z.number().int().min(-4).max(4),
  dealsDamage: z.boolean(),
  duration: z.nativeEnum(SpellDuration),
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
}) satisfies z.ZodType<SpellData>
