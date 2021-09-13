import { AttrValue } from '../../System/Attribute'
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

  specialtySkill?: string
  specialtyName?: string
}
