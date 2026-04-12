import { z } from "zod"

import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { DamageTrackKey } from "#/lib/system/damageTrackKey.ts"
import { GameEffectType } from "#/lib/system/gameEffects/gameEffectType.ts"
import { SkillKey } from "#/lib/system/skills/skillKey.ts"

export interface GameEffectData {
  type: GameEffectType | string
  target?: string
  value: number
}

export interface AttrModEffect extends GameEffectData {
  type: GameEffectType.attrMod
  target: AttributeKey
}

export interface SkillModEffect extends GameEffectData {
  type: GameEffectType.skillMod
  target: SkillKey
}

export interface ExtraInitiativePassesEffect extends GameEffectData {
  type: GameEffectType.extraInitiativePasses
}

export interface PainToleranceEffect extends GameEffectData {
  type: GameEffectType.painTolerance
  target: DamageTrackKey | "all"
}

const InitiativeBonusSchema = z.object({
  type: z.literal(GameEffectType.initiativeBonus),
  target: z.string().optional(),
  value: z.number(),
})

const RecoilReductionSchema = z.object({
  type: z.literal(GameEffectType.recoilReduction),
  target: z.string().optional(),
  value: z.number(),
})

const DicePoolModSchema = z.object({
  type: z.literal(GameEffectType.dicePoolMod),
  target: z.string(),
  value: z.number(),
})

const AttrModSchema = z.object({
  type: z.literal(GameEffectType.attrMod),
  target: z.enum(AttributeKey),
  value: z.number(),
})

const SkillModSchema = z.object({
  type: z.literal(GameEffectType.skillMod),
  target: z.enum(SkillKey),
  value: z.number(),
})

const ExtraInitiativePassesSchema = z.object({
  type: z.literal(GameEffectType.extraInitiativePasses),
  value: z.number(),
})

const PainToleranceSchema = z.object({
  type: z.literal(GameEffectType.painTolerance),
  target: z.union([z.enum(DamageTrackKey), z.literal("all")]),
  value: z.number(),
})

export const GameEffectDataSchema = z.discriminatedUnion("type", [
  InitiativeBonusSchema,
  RecoilReductionSchema,
  DicePoolModSchema,
  AttrModSchema,
  SkillModSchema,
  ExtraInitiativePassesSchema,
  PainToleranceSchema,
]) satisfies z.ZodType<GameEffectData>
