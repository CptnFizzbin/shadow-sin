import { registerAttrNames } from '../../System/Attribute'

export enum ArmorAttr {
  defenseBonus = 'armor.defenseBonus',
  capacity = 'armor.capacity',
}

registerAttrNames({
  [ArmorAttr.defenseBonus]: 'Def Rating',
  [ArmorAttr.capacity]: 'Capacity',
})
