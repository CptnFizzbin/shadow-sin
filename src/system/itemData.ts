import type { UUID } from "node:crypto"

import type { AvailabilityInfo } from "#/system/availabilityInfo.ts"
import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import type { ItemType } from "#/system/itemType.ts"
import type { SourceData } from "#/system/sourceData.ts"

/**
 * Base interface for all gear items, weapons, armor, etc.
 */
export interface ItemData {
  id: UUID
  name: string
  itemType: ItemType

  description?: string
  cost?: number
  quantity?: number
  availability?: AvailabilityInfo
  source?: SourceData
  rating?: number | string

  parentId?: UUID
  childIds?: UUID[]

  notes?: string
  equipped?: boolean
  fixed?: boolean

  wireless?: {
    enabled?: boolean
    removed?: boolean
  }

  effects?: GameEffectData[]
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

