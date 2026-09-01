import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

export enum ArmorRatingType {
  ballistic = "ballistic",
  impact = "impact",
}

export interface ArmorRating {
  [ArmorRatingType.ballistic]: number
  [ArmorRatingType.impact]: number
}

export interface ArmorData extends ItemData, ArmorRating {
  itemType: ItemType.armor

  damage?: {
    ballistic: number
    impact: number
  }
  /**
   * Base armor doesn't stack — only the highest-rated base armor applies.
   * Modifier armor (e.g. helmets, shields) stacks additively on top of the base.
   */
  isModifier?: boolean
}

export function isArmorData(item: ItemData): item is ArmorData {
  return item.itemType === ItemType.armor
}
