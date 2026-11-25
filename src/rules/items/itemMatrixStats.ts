import type { ItemData } from "#data/items/itemData.ts"
import { ItemType } from "#data/items/itemType.ts"
import { itemIsType } from "#data/items/itemUtils.ts"

/** The stats making up an Item's Matrix node, in display order. */
export const itemMatrixStatKeys = ["rating", "response", "system", "firewall", "signal"] as const

export type ItemMatrixStatKey = typeof itemMatrixStatKeys[number]

/** The value every Matrix stat takes when the Item doesn't set its own. */
const defaultItemMatrixStat = 1

/** An Item's Matrix node: its Rating and Matrix attributes. */
export interface ItemMatrixStats {
  values: Record<ItemMatrixStatKey, number>
  /** The stats the Item doesn't set, which show {@link defaultItemMatrixStat} instead. */
  defaulted: ItemMatrixStatKey[]
  /** `false` while the Item's wireless is off or removed. */
  online: boolean
}

function explicitMatrixStats(item: ItemData): Partial<Record<ItemMatrixStatKey, number>> {
  if (!itemIsType(item, ItemType.device)) return {}

  return {
    rating: item.deviceRating,
    response: item.response,
    system: item.system,
    firewall: item.firewall,
    signal: item.signal,
  }
}

function isOnline(item: ItemData): boolean {
  if (!item.wireless) return true
  return !item.wireless.removed && (item.wireless.enabled ?? false)
}

/** Item types with no Matrix presence unless an Item opts in (`matrixDisabled: false`). */
const offlineByDefaultItemTypes: readonly ItemType[] = [ItemType.magical]

/**
 * Whether `item` has a Matrix presence: whatever its `matrixDisabled` says, or, when that's unset,
 * its type's default — Magical gear (such as a Focus) has none, every other Item does.
 */
function hasMatrixPresence(item: Pick<ItemData, "itemType" | "matrixDisabled">): boolean {
  return item.matrixDisabled === undefined
    ? !offlineByDefaultItemTypes.includes(item.itemType)
    : !item.matrixDisabled
}

/**
 * The Matrix node `item` presents, or `undefined` when it has none: it has no Matrix presence
 * (see {@link hasMatrixPresence}), or it's attached to another Item, whose node it shares.
 */
export function getItemMatrixStats(item: ItemData): ItemMatrixStats | undefined {
  if (!hasMatrixPresence(item)) return undefined
  if (item.items.parentId !== null) return undefined

  const explicit = explicitMatrixStats(item)
  const defaulted: ItemMatrixStatKey[] = []
  const values = {} as Record<ItemMatrixStatKey, number>

  for (const key of itemMatrixStatKeys) {
    const value = explicit[key]
    // The device form saves an untouched stat as 0, which no Matrix attribute can be.
    if (value !== undefined && value > 0) {
      values[key] = value
    } else {
      values[key] = defaultItemMatrixStat
      defaulted.push(key)
    }
  }

  return { values, defaulted, online: isOnline(item) }
}
