import { SkillId } from '../System/Skill/SkillData'

export enum EffectType {
  attrBonus = 'attrBonus',
  initBonus = 'initBonus',
  skillBonus = 'skillBonus',
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

interface InitBonus extends BaseGearEffect {
  type: EffectType.initBonus
  dice: number
}

export function isInitBonus (effect: BaseGearEffect): effect is InitBonus {
  return effect.type === EffectType.initBonus
}

interface SkillBonus extends BaseGearEffect {
  type: EffectType.skillBonus
  skill: SkillId
  bonus: number
}

export type Effect =
  | AttrBonus
  | InitBonus
  | SkillBonus
