import { GearData, GearType } from '../../GearData'
import { AutosoftAttr } from './AutosoftAttr'

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
