import { AttrList } from '../System/Attribute'

export type GearId = number | null;
export type Cost = number
export type Availability = {
  rarity: number
  illegal?: boolean
  license?: boolean
}

export enum GearType {
  other = 'other',
  drone = 'drone',
  weapon = 'weapon',
  vehicle = 'vehicle',
  vehicleMod = 'vehicleMod',
  autosoft = 'autosoft',
  rcc = 'rcc',
  augment = 'augment',
  controlRig = 'controlRig',
}

export interface GearData {
  id: GearId
  gearType: GearType
  name: string
  type: string
  avail: Availability
  cost: Cost

  attributes?: AttrList
  attachedTo?: GearId

  [key: string]: unknown
}

export const formatAvail = (avail: Availability): string => {
  return `${avail.rarity}${avail.illegal ? '(i)' : ''}${avail.license ? '(L)' : ''}`
}

const costFormatter = new Intl.NumberFormat('en')
export const formatCost = (cost: number): string => {
  return costFormatter.format(cost) + '¥'
}
