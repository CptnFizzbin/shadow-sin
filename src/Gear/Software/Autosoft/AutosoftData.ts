import { AttributeData } from '../../../System/Attribute'
import { GearData, GearType } from '../../GearData'

export interface AutosoftData extends GearData {
  gearType: GearType.autosoft
  type: string
  attributes: {
    rating: AttributeData<number>
    attr: AttributeData<string>
    skill?: AttributeData<string>
    weapon?: AttributeData<string>
  }
}

export enum AutosoftType {
  targeting = 'Weapon Targeting',
  clearsight = 'clearsight',
  perception = 'Perception',
  evasion = 'Evasion',
  maneuvering = 'Maneuvering',
  electronicWarfare = 'Electronic Warfare',
}
