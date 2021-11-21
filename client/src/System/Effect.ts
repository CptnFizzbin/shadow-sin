import { GearData } from '../Gear/GearData'
import { ActiveSkill } from './Skill/ActiveSkill/ActiveSkillId'

export enum EffectType {
  attrBonus = 'attrBonus',
  attrOverride = 'attrOverride',
  initBonus = 'initBonus',
  skillBonus = 'skillBonus',
  dicePoolBonus = 'dicePoolBonus',
  defRatingBonus = 'defRatingBonus',
  conditionTrackBonus = 'conditionTrackBonus',
}

interface BaseGearEffect {
  type: EffectType
}

interface AttrBonus extends BaseGearEffect {
  type: EffectType.attrBonus
  attr: string
  bonus: number
}

export function isAttrBonus (effect: BaseGearEffect): effect is AttrBonus {
  return effect.type === EffectType.attrBonus
}

interface AttrOverride extends BaseGearEffect {
  type: EffectType.attrOverride
  attr: string
  value: number
}

export function isAttrOverride (effect: BaseGearEffect): effect is AttrOverride {
  return effect.type === EffectType.attrOverride
}

interface InitBonus extends BaseGearEffect {
  type: EffectType.initBonus
  dice: number
}

export function isInitBonus (effect: BaseGearEffect): effect is InitBonus {
  return effect.type === EffectType.initBonus
}

interface SkillBonus extends BaseGearEffect {
  type: EffectType.skillBonus
  skill: ActiveSkill
  bonus: number
}

export function isSkillBonus (effect: BaseGearEffect): effect is SkillBonus {
  return effect.type === EffectType.skillBonus
}

interface DicePoolBonus extends BaseGearEffect {
  type: EffectType.dicePoolBonus
  poolType: string
  bonus: number
}

export function isDicePoolBonus (effect: BaseGearEffect): effect is DicePoolBonus {
  return effect.type === EffectType.dicePoolBonus
}

interface DefRatingBonus extends BaseGearEffect {
  type: EffectType.defRatingBonus
  bonus: number
}

export function isDefRatingBonus (effect: BaseGearEffect): effect is DefRatingBonus {
  return effect.type === EffectType.defRatingBonus
}

interface ConditionTrackBonus extends BaseGearEffect {
  type: EffectType.conditionTrackBonus
  track: string
  bonus: number
}

export function isConditionTrackBonus (effect: BaseGearEffect): effect is ConditionTrackBonus {
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

export const collectGearEffects = (gear: GearData[]): Effect[] => {
  return gear
    .filter(gear => gear.effects)
    .flatMap(gear => gear.effects as Effect[])
}
