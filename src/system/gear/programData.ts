import type { ItemData } from "#/system/itemData.ts"
import type { ItemType } from "#/system/itemType.ts"

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
  itemType: ItemType.program
  rating: number
  programType: ProgramType
}
