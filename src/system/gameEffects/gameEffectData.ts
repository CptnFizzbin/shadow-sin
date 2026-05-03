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
 * Modifier for wound penalties (Pain Tolerance).
 */
export interface PainToleranceEffect extends GameEffectData {
  type: GameEffectType.painTolerance
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

const ExtraInitiativeDiceSchema = z.object({
  type: z.literal(GameEffectType.extraInitiativeDice),
  value: z.number(),
})

const PainToleranceSchema = z.object({
  type: z.literal(GameEffectType.painTolerance),
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
]) satisfies z.ZodType<GameEffectData>

/**
 * A temporary, user-managed game effect that can be toggled on/off without
 * touching any gear item or quality. Lives on `CharacterSheet.temporaryEffects`.
 */
export interface TemporaryEffectData extends GameEffectData {
  /** UUID used as a React key and for toggle/remove targeting. */
  id: string
  /** Short human-readable name shown in the UI, e.g. "Team Coordination". */
  label: string
  /** Whether the effect is currently contributing to dice pool calculations. */
  enabled: boolean
}

export const TemporaryEffectDataSchema = z.object({
  id: z.string(),
  label: z.string(),
  enabled: z.boolean(),
  type: z.string(),
  target: z.string().optional(),
  subTarget: z.string().optional(),
  value: z.number(),
}) satisfies z.ZodType<TemporaryEffectData>
