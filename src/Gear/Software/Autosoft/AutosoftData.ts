import { AttributeData } from '../../../System/Attribute'
import { GearData, GearType } from '../../GearData'

export enum AutosoftAttr {
  rating = 'autosoft.rating',
  attr = 'autosoft.attr',
  skill = 'autosoft.skill',
  weapon = 'autosoft.weapon',
}

export interface AutosoftData extends GearData {
  gearType: GearType.autosoft
  type: string
  attributes: {
    [AutosoftAttr.rating]: AttributeData<number>
    [AutosoftAttr.attr]: AttributeData<string>
    [AutosoftAttr.skill]?: AttributeData<string>
    [AutosoftAttr.weapon]?: AttributeData<string>
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
