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

interface InitBonus extends BaseGearEffect {
  type: EffectType.initBonus
  bonus: number
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
