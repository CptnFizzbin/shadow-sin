import { AttributeList } from '../System/Attribute'
import { Availability, Cost } from './Stats'

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
}

export interface GearData {
  id: GearId
  gearType: GearType
  name: string
  type: string
  avail: Availability
  cost: Cost

  attributes?: AttributeList
  attachedTo?: GearId

  [key: string]: unknown
}
