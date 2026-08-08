import { z } from "zod"

import { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import { GameEffectType } from "./gameEffectType.ts"

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
 * @deprecated Use `HighPainToleranceEffect` or `LowPainToleranceEffect` instead.
 * Retained only for parsing old runner data before the 011_splitPainToleranceEffects migration runs.
 */
export interface PainToleranceEffect extends GameEffectData {
  type: GameEffectType.painTolerance
  target: DamageTrackKey | "all"
}

/**
 * High Pain Tolerance: ignore the first `value` boxes of damage on the target
 * track when calculating wound modifiers. The wound interval is unchanged.
 * `value` must be positive (equal to the quality rating).
 */
export interface HighPainToleranceEffect extends GameEffectData {
  type: GameEffectType.highPainTolerance
  target: DamageTrackKey | "all"
}

/**
 * Low Pain Tolerance: shrinks the wound interval so wound penalties kick in
 * sooner. `value` must be negative (–1 → interval becomes 2 instead of 3).
 */
export interface LowPainToleranceEffect extends GameEffectData {
  type: GameEffectType.lowPainTolerance
  target: DamageTrackKey | "all"
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
  /** @deprecated Use `highPainTolerance` or `lowPainTolerance` instead. */
  [GameEffectType.painTolerance]: PainToleranceEffect
  [GameEffectType.highPainTolerance]: HighPainToleranceEffect
  [GameEffectType.lowPainTolerance]: LowPainToleranceEffect
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

const ExtraInitiativeDiceSchema = z.object({
  type: z.literal(GameEffectType.extraInitiativeDice),
  value: z.number(),
})

/**
 * @deprecated Use `HighPainToleranceSchema` or `LowPainToleranceSchema` instead.
 * Retained for parsing old runner data before the 011_splitPainToleranceEffects migration runs.
 */
const PainToleranceSchema = z.object({
  type: z.literal(GameEffectType.painTolerance),
  target: z.union([z.enum(DamageTrackKey), z.literal("all")]),
  value: z.number(),
})

const HighPainToleranceSchema = z.object({
  type: z.literal(GameEffectType.highPainTolerance),
  target: z.union([z.enum(DamageTrackKey), z.literal("all")]),
  value: z.number(),
})

const LowPainToleranceSchema = z.object({
  type: z.literal(GameEffectType.lowPainTolerance),
  target: z.union([z.enum(DamageTrackKey), z.literal("all")]),
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
  HighPainToleranceSchema,
  LowPainToleranceSchema,
]) satisfies z.ZodType<GameEffectData>
