import type { GearData, GearType } from "#/lib/system/types/gear/gearData.ts"

export interface DeviceData extends GearData {
  type: GearType.device
  programs: SoftwareData[]

  operatingSystem?: string
  response?: number
  signal?: number
  eccm?: number
  firewall?: number
  system?: number
}

export interface SoftwareData extends GearData {
  type: GearType.software
  rating: number
}
