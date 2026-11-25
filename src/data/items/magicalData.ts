import type { FocusType } from "#data/magic/focusData.ts"
import type { SpellCategory } from "#data/magic/spellData.ts"
import type { SpiritType } from "#data/magic/spiritData.ts"

import type { ItemData } from "./itemData.ts"
import { ItemType } from "./itemType.ts"

/** The kinds of Magical gear. */
export enum MagicalType {
  focus = "focus",
}

export const MagicalTypeLabel: Record<MagicalType, string> = {
  [MagicalType.focus]: "Focus",
}

/** Gear with a magical nature, such as a Focus. */
export interface MagicalData extends ItemData {
  itemType: ItemType.magical
  magicalType: MagicalType
}

/**
 * A Focus: owning one does nothing by itself. Once Bonded it can be Equipped (and Stashed) freely,
 * and only a Bonded, Equipped Focus adds its Game Effects.
 */
export interface FocusData extends MagicalData {
  magicalType: MagicalType.focus
  focusType: FocusType
  force: number
  /** The spell category a Spellcasting, Counterspelling, or Sustaining Focus is tied to. */
  spellCategory?: SpellCategory
  /** The spirit type a Summoning, Banishing, or Binding Focus is tied to. */
  spiritType?: SpiritType
  /** Whether the Runner has paid the Karma to Bond this Focus. */
  bonded?: boolean
}

function isMagicalData(item: ItemData): item is MagicalData {
  return item.itemType === ItemType.magical
}

export function isFocusData(item: ItemData): item is FocusData {
  return isMagicalData(item) && item.magicalType === MagicalType.focus
}
