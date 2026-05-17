import type { ItemData } from "#/system/itemData.ts"

export interface DeviceData extends ItemData {
  deviceType?: "commlink" | "other"
  /** Custom label shown when deviceType is "other" */
  customDeviceType?: string
  /** Brand/model name — shown when deviceType is "commlink" */
  deviceModel?: string
  deviceOS?: string

  deviceRating?: number
  response?: number
  signal?: number
  system?: number
  firewall?: number
  dataProcessing?: number
  programSlots?: number
}
