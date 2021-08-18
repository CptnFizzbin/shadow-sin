import { AttributeData } from '../../System/Attribute'
import { GearData } from '../GearData'

export interface WeaponData extends GearData {
  attributes: {
    dv: AttributeData<string>
    attackRatings: AttributeData<string>
    modes?: AttributeData<string>
    ammo?: AttributeData<string>
  }

  specialtySkill: string
  specialtyName: string
}
