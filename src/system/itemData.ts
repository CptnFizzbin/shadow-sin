import type { UUID } from "node:crypto"

import type { AvailablityInfo } from "#/system/availablityInfo.ts"
import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import type { ItemType } from "#/system/itemType.ts"
import type { SourceData } from "#/system/sourceData.ts"

export interface ItemData {
  id: UUID
  name: string
  itemType: ItemType

  description?: string
  cost?: number
  quantity?: number
  availability?: AvailablityInfo
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

export function createItemMap(...items: (ItemData | ItemData[])[]): Record<string, ItemData> {
  return Object.fromEntries(items.flat().map((item) => [item.id, item]))
}
