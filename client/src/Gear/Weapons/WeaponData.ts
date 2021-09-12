import { AttrValue } from '../../System/Attribute'
import { registerAttrNames } from '../../UI/AttributeBlock'
import { GearData } from '../GearData'

export enum WeaponAttr {
  dv = 'weapon.dv',
  attackRatings = 'weapon.attackRatings',
  modes = 'weapon.modes',
  ammo = 'weapon.ammo',
}

registerAttrNames({
  [WeaponAttr.dv]: 'DV',
  [WeaponAttr.attackRatings]: 'Atk. Ratings',
  [WeaponAttr.modes]: 'Modes',
  [WeaponAttr.ammo]: 'Ammo',
})

export interface WeaponData extends GearData {
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
