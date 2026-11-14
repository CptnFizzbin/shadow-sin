import { z } from "zod"

import { ItemType } from "./itemType.ts"

/**
 * Where an Item is right now. Exactly one applies at a time, and the Item's type decides which it
 * can be in (see {@link itemStatesByType}). An Item with no stored state is {@link ItemState.available}.
 */
export enum ItemState {
  /** Worn or wielded — the Item's Game Effects apply. */
  equipped = "equipped",
  /** Installed in the Runner's body — the Item's Game Effects apply. */
  implanted = "implanted",
  /** On hand, but neither Equipped nor Implanted. */
  available = "available",
  /** Left behind (e.g. at the safehouse), not carried. */
  stashed = "stashed",
}

export const ItemStateSchema = z.enum(ItemState) satisfies z.ZodType<ItemState>

const equippable = [ItemState.equipped, ItemState.available, ItemState.stashed] as const
const implantable = [ItemState.implanted, ItemState.available, ItemState.stashed] as const
const carryOnly = [ItemState.available, ItemState.stashed] as const

/** The states each `ItemType` can be in, most active first. */
export const itemStatesByType: Record<ItemType, readonly ItemState[]> = {
  [ItemType.weapon]: equippable,
  [ItemType.firearm]: equippable,
  [ItemType.armor]: equippable,
  [ItemType.device]: equippable,
  [ItemType.other]: equippable,
  [ItemType.implant]: implantable,
  [ItemType.program]: carryOnly,
  [ItemType.software]: carryOnly,
  [ItemType.vehicle]: carryOnly,
  [ItemType.credstick]: carryOnly,
  [ItemType.sin]: carryOnly,
  [ItemType.license]: carryOnly,
  [ItemType.firearmAccessory]: carryOnly,
}
