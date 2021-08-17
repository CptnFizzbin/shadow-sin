import { GearData, GearType } from '../../GearData'

export interface AutosoftData extends GearData {
  gearType: GearType.autosoft
  type: string
  rating: number
  attr: string
  skill?: string
  weapon?: string
}

export enum AutosoftType {
  targeting = 'Weapon Targeting',
  clearsight = 'clearsight',
  perception = 'Perception',
  evasion = 'Evasion',
  maneuvering = 'Maneuvering',
  electronicWarfare = 'Electronic Warfare',
}
