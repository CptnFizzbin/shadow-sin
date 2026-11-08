import { z } from "zod"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { GameEffectData } from "#/system/model/gameEffects/gameEffectData.ts"
import { GameEffectDataSchema } from "#/system/model/gameEffects/gameEffectData.ts"
import type { SourceData } from "#/system/model/sourceData.ts"
import { SourceDataSchema } from "#/system/model/sourceData.ts"

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

/** Who a sustained Spell is cast on — only a Spell sustained on its caster grants them its Game Effects. */
export enum SpellSustainTarget {
  Self = "Self",
  Other = "Other",
}

export interface SpellData {
  kind: EntityKind.spell
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
  /** Who the Spell is sustained on; absent means `Self`. */
  sustainedOn?: SpellSustainTarget
}

export const SpellDataSchema = z.object({
  kind: z.literal(EntityKind.spell),
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
  source: SourceDataSchema.optional(),
  effects: GameEffectDataSchema.array().optional(),
  sustained: z.boolean().optional(),
  sustainedOn: z.enum(SpellSustainTarget).optional(),
}) satisfies z.ZodType<SpellData>
