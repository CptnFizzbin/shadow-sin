import { AttrList } from '../System/Attribute'
import { Availability } from './Stats/Availability'
import { Cost } from './Stats/Cost'

export type GearId = number | null;

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
