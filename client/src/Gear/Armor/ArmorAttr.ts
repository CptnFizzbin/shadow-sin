import { AttrNames } from '../../System/Attribute'

export enum ArmorAttr {
  defenseBonus = 'armor.defenseBonus',
  capacity = 'armor.capacity',
}

export const ArmorAttrNames: AttrNames = {
  [ArmorAttr.defenseBonus]: 'Def Rating',
  [ArmorAttr.capacity]: 'Capacity',
}
