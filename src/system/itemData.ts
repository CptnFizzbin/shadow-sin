import type { UUID } from "node:crypto"

import type { AvailabilityInfo } from "./availabilityInfo.ts"
import type { EntityData } from "./entityData.ts"
import type { ItemType } from "./itemType.ts"

/**
 * Base interface for all gear items, weapons, armor, etc.
 */
export interface ItemData extends EntityData {
  id: UUID
  itemType: ItemType

  cost?: number
  quantity?: number
  availability?: AvailabilityInfo

  parentId?: UUID
  childIds?: UUID[]

  /**
   * The Licence (`ItemType.license`) authorizing this Restricted item.
   * A Licence may cover multiple items — typically several instances of the
   * same gear — but each item is covered by at most one Licence.
   */
  licenseId?: UUID | null

  notes?: string
  equipped?: boolean
  stashed?: boolean
  fixed?: boolean

  wireless?: {
    enabled?: boolean
    removed?: boolean
  }

  /** State object to track data between states */
  _state?: {
    equipOnUnstash?: boolean
  }
}

/**
 * Utility to create a gear item with unique IDs and optional attached items (e.g. accessories).
 */
export function createItem<TItem extends ItemData>(
  data: Omit<TItem, "id" | "childIds">,
): ItemData[]
export function createItem<TItem extends ItemData>(
  data: Omit<TItem, "id" | "childIds">,
  attached: (ItemData | ItemData[])[],
): ItemData[]
export function createItem<TItem extends ItemData>(
  data: Omit<TItem, "id" | "childIds">,
  attached: (ItemData | ItemData[])[] = [],
): ItemData[] {
  const id = crypto.randomUUID()
  const childIds = attached.flat().map((item) => item.id)

  return [
    { ...data, id, childIds },
    ...attached.flat().map((item) => ({ ...item, parentId: id })),
  ]
}

/**
 * Utility to convert an array of items into a Record keyed by their ID.
 */
export function createItemMap(...items: (ItemData | ItemData[])[]): Record<string, ItemData> {
  return Object.fromEntries(items.flat().map((item) => [item.id, item]))
}
