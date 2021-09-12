import { SkillId } from '../System/Skill/SkillData'

export enum EffectType {
  attrBonus = 'attrBonus',
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
  | InitBonus
  | SkillBonus
  | DicePoolBonus
