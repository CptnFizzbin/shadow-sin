import { Availability, Cost } from './Stats'

export type GearId = number | null;

export enum GearType {
  other,
  drone,
  weapon,
  vehicle,
  vehicleMod,
  autosoft,
}

export interface GearData {
  id: GearId
  gearType: GearType
  name: string
  type: string
  avail: Availability
  cost: Cost
  quantity?: number
  stats?: {
    [key: string]: string | number | null
  }
  attachedTo?: GearId

  [key: string]: unknown
}
