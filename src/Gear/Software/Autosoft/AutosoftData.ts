import { AttrNames } from '../../../System/Attribute'
import { GearData, GearType } from '../../GearData'

export enum AutosoftAttr {
  rating = 'autosoft.rating',
  attr = 'autosoft.attr',
  skill = 'autosoft.skill',
  weapon = 'autosoft.weapon',
}

export const AutosoftAttrNames: AttrNames = {
  [AutosoftAttr.rating]: 'Rating',
  [AutosoftAttr.attr]: 'Attr',
  [AutosoftAttr.skill]: 'Skill',
  [AutosoftAttr.weapon]: 'Weapon',
}

export interface AutosoftData extends GearData {
  gearType: GearType.autosoft
  type: string
  attributes: {
    [AutosoftAttr.rating]: number
    [AutosoftAttr.attr]: string
    [AutosoftAttr.skill]?: string
    [AutosoftAttr.weapon]?: string
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
