import { z } from "zod"

import { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export interface GameEffectData {
  type: GameEffectType | string
  target?: string
  subTarget?: string
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

export interface SkillSpecializationModEffect extends GameEffectData {
  type: GameEffectType.skillSpecializationMod
  target: SkillKey
  subTarget: string
}

export interface InitiativeBonusEffect extends GameEffectData {
  type: GameEffectType.initiativeBonus
}

export interface RecoilReductionEffect extends GameEffectData {
  type: GameEffectType.recoilReduction
}

export interface DicePoolModEffect extends GameEffectData {
  type: GameEffectType.dicePoolMod
  target: string
}

export interface ExtraInitiativePassesEffect extends GameEffectData {
  type: GameEffectType.extraInitiativePasses
}

export interface PainToleranceEffect extends GameEffectData {
  type: GameEffectType.painTolerance
  target: DamageTrackKey | "all"
}

export type EffectByType = {
  [GameEffectType.attrMod]: AttrModEffect
  [GameEffectType.skillMod]: SkillModEffect
  [GameEffectType.skillSpecializationMod]: SkillSpecializationModEffect
  [GameEffectType.initiativeBonus]: InitiativeBonusEffect
  [GameEffectType.extraInitiativePasses]: ExtraInitiativePassesEffect
  [GameEffectType.painTolerance]: PainToleranceEffect
  [GameEffectType.recoilReduction]: RecoilReductionEffect
  [GameEffectType.dicePoolMod]: DicePoolModEffect
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

const SkillSpecializationModSchema = z.object({
  type: z.literal(GameEffectType.skillSpecializationMod),
  target: z.enum(SkillKey),
  subTarget: z.string(),
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
  SkillSpecializationModSchema,
  ExtraInitiativePassesSchema,
  PainToleranceSchema,
]) satisfies z.ZodType<GameEffectData>
