import type { GearData, GearType } from "#/lib/system/types/gear/gearData.ts"

export interface DeviceData extends GearData {
  itemType: GearType.device
  programs: SoftwareData[]

  operatingSystem?: string
  response?: number
  signal?: number
  eccm?: number
  firewall?: number
  system?: number
}

export interface SoftwareData extends GearData {
  itemType: GearType.software
  rating: number
}
