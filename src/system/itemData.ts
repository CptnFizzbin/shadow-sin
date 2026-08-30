import type { UUID } from "#/lib/uuidUtils.ts"

import type { AvailabilityInfo } from "./availabilityInfo.ts"
import type { EntityWithItems } from "./entities/entityTraits.ts"
import type { EntityData } from "./entityData.ts"
import { EntityKind } from "./entityKind.ts"
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
 * Distributes `Omit` across a union so each member keeps only its own fields — plain `Omit<T, K>`
 * collapses a union to the keys its members share, which would silently drop `SinData`/
 * `LicenseData`-style discriminated-union fields (e.g. `rating`) that aren't common to every
 * branch.
 */
export type DistributiveOmit<T, K extends keyof never> = T extends unknown ? Omit<T, K> : never

/**
 * Utility to create a gear item with unique IDs and optional attached items (e.g. accessories).
 */
export function createItem<TItem extends ItemData>(
  data: DistributiveOmit<TItem, "id" | "items" | "kind">,
): ItemData[]
export function createItem<TItem extends ItemData>(
  data: DistributiveOmit<TItem, "id" | "items" | "kind">,
  attached: (ItemData | ItemData[])[],
): ItemData[]
export function createItem<TItem extends ItemData>(
  data: DistributiveOmit<TItem, "id" | "items" | "kind">,
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
