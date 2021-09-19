import { registerAttrNames } from '../../System/Attribute'

export enum WeaponAttr {
  dv = 'weapon.dv',
  attackRatings = 'weapon.attackRatings',
  modes = 'weapon.modes',
  ammo = 'weapon.ammo',
  maxRange = 'weapon.maxRange',
}

registerAttrNames({
  [WeaponAttr.dv]: 'DV',
  [WeaponAttr.attackRatings]: 'Atk. Ratings',
  [WeaponAttr.modes]: 'Modes',
  [WeaponAttr.ammo]: 'Ammo',
  [WeaponAttr.maxRange]: 'Max Range',
})
