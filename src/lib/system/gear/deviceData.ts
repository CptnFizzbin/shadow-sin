import { GearType } from "#/lib/system/gearType.ts"
import type { ItemData } from "#/lib/system/itemData.ts"

export interface DeviceData extends ItemData {
  itemType: GearType.device

  deviceRating?: number
  response?: number
  signal?: number
  system?: number
  firewall?: number
  dataProcessing?: number
  programSlots?: number
}

export function isDeviceData(item: ItemData): item is DeviceData {
  return item.itemType === GearType.device
}
