import { GearType } from "#/lib/system/gearType.ts"
import type { ItemData } from "#/lib/system/itemData.ts"

export enum ProgramType {
  attack = "attack",
  browse = "browse",
  command = "command",
  dataSearch = "dataSearch",
  decrypt = "decrypt",
  eccm = "eccm",
  edit = "edit",
  encrypt = "encrypt",
  exploit = "exploit",
  medic = "medic",
  scan = "scan",
  spoof = "spoof",
  stealth = "stealth",
  track = "track",
  other = "other",
}

export interface ProgramData extends ItemData {
  itemType: GearType.program
  rating: number
  programType: ProgramType
}

export function isProgramData(item: ItemData): item is ProgramData {
  return item.itemType === GearType.program
}
