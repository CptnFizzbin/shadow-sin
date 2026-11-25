import type { ItemData } from "./itemData.ts"
import { ItemType } from "./itemType.ts"

/** The kinds of Consumable gear. */
export enum ConsumableType {
  drug = "drug",
}

export const ConsumableTypeLabel: Record<ConsumableType, string> = {
  [ConsumableType.drug]: "Drug",
}

/**
 * Gear that is used up: each Consume spends one unit of `quantity` and makes the Item Active, so
 * its Game Effects apply until the Player ends them.
 */
export interface ConsumableData extends ItemData {
  itemType: ItemType.consumable
  consumableType: ConsumableType
}

/** A drug or compound — a Consumable whose rules are described in free text. */
export interface DrugData extends ConsumableData {
  consumableType: ConsumableType.drug

  /** How long the drug's effects last once taken, e.g. "10 × 1D6 minutes". */
  duration?: string
  /** What happens when the drug wears off. */
  crash?: string
  /**
   * What the drug does while it's in effect, as written in the rules. Mechanical changes the app
   * applies go in the Item's Game Effects (`effects`) instead.
   */
  effectDescription?: string
}

function isConsumableData(item: ItemData): item is ConsumableData {
  return item.itemType === ItemType.consumable
}

export function isDrugData(item: ItemData): item is DrugData {
  return isConsumableData(item) && item.consumableType === ConsumableType.drug
}
