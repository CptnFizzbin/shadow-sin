import { GearType } from "#/lib/system/gearType.ts"
import type { ItemData } from "#/lib/system/itemData.ts"

export interface DeviceData extends ItemData {
  itemType: GearType.device

  operatingSystem?: string
  response?: number
  signal?: number
  eccm?: number
  firewall?: number
  system?: number
}

export function isDeviceData(item: ItemData): item is DeviceData {
  return item.itemType === GearType.device
}
