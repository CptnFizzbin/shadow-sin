import type { UUID } from "#common/uuid/uuidUtils.ts"
import type { EntityData } from "#data/entities/entityData.ts"
import { EntityKind } from "#data/entities/entityKind.ts"
import type { EntityWithItems } from "#data/entities/entityTraits.ts"

import type { AvailabilityInfo } from "./availabilityInfo.ts"
import type { ItemState } from "./itemState.ts"
import type { ItemType } from "./itemType.ts"

/**
 * Base interface for all gear items, weapons, armor, etc.
 */
export interface ItemData extends EntityData, EntityWithItems {
  kind: EntityKind.item
  id: UUID
  itemType: ItemType

  cost?: number
  quantity?: number
  availability?: AvailabilityInfo

  /**
   * The Licence (`ItemType.license`) authorizing this Restricted item.
   * A Licence may cover multiple items — typically several instances of the
   * same gear — but each item is covered by at most one Licence.
   */
  licenseId?: UUID | null

  notes?: string
  /** Where the Item is right now; its type decides which states are allowed. Absent means Available. */
  state?: ItemState
  fixed?: boolean

  wireless?: {
    enabled?: boolean
    removed?: boolean
  }

  /**
   * Whether this item opts out of having a Matrix presence: when `true` it isn't a node and shows
   * no Matrix stats; when `false` it is one. Absent means its type's default — Magical gear has no
   * Matrix presence, every other item does.
   */
  matrixDisabled?: boolean
}

/**
 * Utility to create a gear item with unique IDs and optional attached items (e.g. accessories).
 */
export function createItem<TItem extends ItemData>(
  data: Omit<TItem, "id" | "items" | "kind">,
): ItemData[]
export function createItem<TItem extends ItemData>(
  data: Omit<TItem, "id" | "items" | "kind">,
  attached: (ItemData | ItemData[])[],
): ItemData[]
export function createItem<TItem extends ItemData>(
  data: Omit<TItem, "id" | "items" | "kind">,
  attached: (ItemData | ItemData[])[] = [],
): ItemData[] {
  const id = crypto.randomUUID()
  const childIds = attached.flat().map((item) => item.id)

  return [
    { ...data, id, kind: EntityKind.item, items: { parentId: null, childIds } },
    ...attached.flat().map((item) => ({ ...item, items: { ...item.items, parentId: id } })),
  ]
}

/**
 * Utility to convert an array of items into a Record keyed by their ID.
 */
export function createItemMap(...items: (ItemData | ItemData[])[]): Record<string, ItemData> {
  return Object.fromEntries(items.flat().map((item) => [item.id, item]))
}
