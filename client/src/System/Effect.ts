import {GearData} from '../Gear/GearData'
import {ActiveSkill} from './Skill/ActiveSkill/ActiveSkillId'

export enum EffectType {
  attrBonus = 'attrBonus',
  attrOverride = 'attrOverride',
  initBonus = 'initBonus',
  skillBonus = 'skillBonus',
  dicePoolBonus = 'dicePoolBonus',
  defRatingBonus = 'defRatingBonus',
  conditionTrackBonus = 'conditionTrackBonus',
  woundPenaltyReduction = 'woundPenaltyReduction',
}

interface BaseEffect {
  type: EffectType
}

interface AttrBonus extends BaseEffect {
  type: EffectType.attrBonus
  attr: string
  bonus: number
}

export function isAttrBonus(effect: BaseEffect): effect is AttrBonus {
  return effect.type === EffectType.attrBonus
}

interface AttrOverride extends BaseEffect {
  type: EffectType.attrOverride
  attr: string
  value: number
}

export function isAttrOverride(effect: BaseEffect): effect is AttrOverride {
  return effect.type === EffectType.attrOverride
}

interface InitBonus extends BaseEffect {
  type: EffectType.initBonus
  dice: number
}

export function isInitBonus(effect: BaseEffect): effect is InitBonus {
  return effect.type === EffectType.initBonus
}

interface SkillBonus extends BaseEffect {
  type: EffectType.skillBonus
  skill: ActiveSkill
  bonus: number
}

export function isSkillBonus(effect: BaseEffect): effect is SkillBonus {
  return effect.type === EffectType.skillBonus
}

interface DicePoolBonus extends BaseEffect {
  type: EffectType.dicePoolBonus
  poolType: string
  bonus: number
}

export function isDicePoolBonus(effect: BaseEffect): effect is DicePoolBonus {
  return effect.type === EffectType.dicePoolBonus
}

interface DefRatingBonus extends BaseEffect {
  type: EffectType.defRatingBonus
  bonus: number
}

export function isDefRatingBonus(effect: BaseEffect): effect is DefRatingBonus {
  return effect.type === EffectType.defRatingBonus
}

interface ConditionTrackBonus extends BaseEffect {
  type: EffectType.conditionTrackBonus
  track: string
  bonus: number
}

export function isConditionTrackBonus(effect: BaseEffect): effect is ConditionTrackBonus {
  return effect.type === EffectType.conditionTrackBonus
}

interface WoundPenaltyReduction extends BaseEffect {
  type: EffectType.woundPenaltyReduction
  value: number | 'all'
}

export function isWoundReduction(effect: BaseEffect): effect is WoundPenaltyReduction {
  return effect.type === EffectType.conditionTrackBonus
}

export type Effect =
  | AttrBonus
  | AttrOverride
  | InitBonus
  | SkillBonus
  | DicePoolBonus
  | DefRatingBonus
  | ConditionTrackBonus
  | WoundPenaltyReduction

export const collectGearEffects = (gear: GearData[]): Effect[] => {
  return gear
    .filter(gear => gear.effects)
    .flatMap(gear => gear.effects as Effect[])
}
