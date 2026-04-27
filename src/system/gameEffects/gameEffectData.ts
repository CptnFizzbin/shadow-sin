import { z } from "zod"

import { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

/**
 * Base interface for all game effects.
 */
export interface GameEffectData {
  type: GameEffectType | string
  target?: string
  subTarget?: string
  value: number
}

/**
 * Modifier for a specific attribute.
 */
export interface AttrModEffect extends GameEffectData {
  type: GameEffectType.attrMod
  target: AttributeKey
}

/**
 * Modifier for a specific skill rating.
 */
export interface SkillModEffect extends GameEffectData {
  type: GameEffectType.skillMod
  target: SkillKey
}

/**
 * Modifier for a skill specialization.
 */
export interface SkillSpecializationModEffect extends GameEffectData {
  type: GameEffectType.skillSpecializationMod
  target: SkillKey
  subTarget: string
}

/**
 * Flat bonus to initiative score.
 */
export interface InitiativeBonusEffect extends GameEffectData {
  type: GameEffectType.initiativeBonus
}

/**
 * Flat bonus to recoil reduction.
 */
export interface RecoilReductionEffect extends GameEffectData {
  type: GameEffectType.recoilReduction
}

/**
 * Generic modifier for a named dice pool.
 */
export interface DicePoolModEffect extends GameEffectData {
  type: GameEffectType.dicePoolMod
  target: string
}

/**
 * Bonus to initiative passes.
 */
export interface ExtraInitiativePassesEffect extends GameEffectData {
  type: GameEffectType.extraInitiativePasses
}

/**
 * Bonus to initiative dice pool (e.g. Wired Reflexes adds extra dice).
 */
export interface ExtraInitiativeDiceEffect extends GameEffectData {
  type: GameEffectType.extraInitiativeDice
}

/**
 * Modifier for wound penalties (Pain Tolerance).
 */
export interface PainToleranceEffect extends GameEffectData {
  type: GameEffectType.painTolerance
  target: DamageTrackKey | "all"
}

/**
 * Flat penalty to all general action dice pools (active skills, initiative).
 * Used for concentration penalties from sustaining spells without a sustaining focus.
 * Drain resistance is exempt — it uses raw attributes.
 */
export interface GeneralPenaltyEffect extends GameEffectData {
  type: GameEffectType.generalPenalty
}

/**
 * Mapped type for looking up concrete effect interfaces by their type enum.
 */
export type EffectByType = {

  [GameEffectType.attrMod]: AttrModEffect
  [GameEffectType.skillMod]: SkillModEffect
  [GameEffectType.skillSpecializationMod]: SkillSpecializationModEffect
  [GameEffectType.initiativeBonus]: InitiativeBonusEffect
  [GameEffectType.extraInitiativePasses]: ExtraInitiativePassesEffect
  [GameEffectType.extraInitiativeDice]: ExtraInitiativeDiceEffect
  [GameEffectType.painTolerance]: PainToleranceEffect
  [GameEffectType.recoilReduction]: RecoilReductionEffect
  [GameEffectType.dicePoolMod]: DicePoolModEffect
  [GameEffectType.generalPenalty]: GeneralPenaltyEffect
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

const ExtraInitiativeDiceSchema = z.object({
  type: z.literal(GameEffectType.extraInitiativeDice),
  value: z.number(),
})

const PainToleranceSchema = z.object({
  type: z.literal(GameEffectType.painTolerance),
  target: z.union([z.enum(DamageTrackKey), z.literal("all")]),
  value: z.number(),
})

const GeneralPenaltySchema = z.object({
  type: z.literal(GameEffectType.generalPenalty),
  value: z.number(),
})

/**
 * Discriminated union schema for all game effects.
 */
export const GameEffectDataSchema = z.discriminatedUnion("type", [

  InitiativeBonusSchema,
  RecoilReductionSchema,
  DicePoolModSchema,
  AttrModSchema,
  SkillModSchema,
  SkillSpecializationModSchema,
  ExtraInitiativePassesSchema,
  ExtraInitiativeDiceSchema,
  PainToleranceSchema,
  GeneralPenaltySchema,
]) satisfies z.ZodType<GameEffectData>
