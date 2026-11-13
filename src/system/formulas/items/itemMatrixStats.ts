import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { itemIsType } from "#/system/model/items/itemUtils.ts"

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

/**
 * The Matrix node `item` presents, or `undefined` when it has none: it opted out
 * (`matrixDisabled`), or it's attached to another Item, whose node it shares.
 */
export function getItemMatrixStats(item: ItemData): ItemMatrixStats | undefined {
  if (item.matrixDisabled) return undefined
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
