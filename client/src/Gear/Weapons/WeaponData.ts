import { AttrValue } from '../../System/Attribute'
import { ActiveSkill } from '../../System/Skill/ActiveSkill/ActiveSkillId'
import { BaseGearData } from '../GearData'
import { WeaponAttr } from './WeaponAttr'

export interface WeaponData extends BaseGearData {
  attributes: {
    [WeaponAttr.dv]: string
    [WeaponAttr.attackRatings]: string
    [WeaponAttr.modes]?: string
    [WeaponAttr.ammo]?: string
    [key: string]: AttrValue
  }

  skill: ActiveSkill
  specialtyName?: string
}
