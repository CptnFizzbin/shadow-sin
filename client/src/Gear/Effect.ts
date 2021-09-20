import { ActiveSkillId } from '../System/Skill/ActiveSkill/ActiveSkillId'
import { GearData } from './GearData'

export enum EffectType {
  attrBonus = 'attrBonus',
  attrOverride = 'attrOverride',
  initBonus = 'initBonus',
  skillBonus = 'skillBonus',
  dicePoolBonus = 'dicePoolBonus',
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
  skill: ActiveSkillId
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

export type Effect =
  | AttrBonus
  | AttrOverride
  | InitBonus
  | SkillBonus
  | DicePoolBonus

export const collectGearEffects = (gear: GearData[]): Effect[] => {
  return gear
    .filter(gear => gear.effects)
    .flatMap(gear => gear.effects as Effect[])
}
