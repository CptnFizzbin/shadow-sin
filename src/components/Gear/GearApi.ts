import type { ReadonlyStore, Store } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"

import type { ItemData } from "#/lib/system/ItemData.ts"

export interface RemoveItemOptions {
  removeChildren?: boolean
}

export interface GearApi {
  store: ReadonlyStore<Record<string, ItemData>>

  get(id: string): ItemData | undefined

  set(item: ItemData): void

  set(itemId: string, item: ItemData): void

  add(item: Omit<ItemData, "id">): void

  remove(item: ItemData, options?: RemoveItemOptions): void

  remove(itemId: string, options?: RemoveItemOptions): void

  getParent(item: ItemData): ItemData | undefined

  getParent(itemID: string): ItemData | undefined

  getChildren(item: ItemData): ItemData[]

  getChildren(itemId: string): ItemData[]

  getByType<TItem = ItemData>(itemType: string): TItem[]

  addChild(parent: ItemData, child: ItemData): void

  addChild(parentId: string, child: ItemData): void

  addChild(parent: ItemData, childId: string): void

  addChild(parentId: string, childId: string): void

}

export function createGearApi(
  store: Store<{ gear: Record<string, ItemData> }>,
): GearApi {
  const gearStore = createStore(() => store.state.gear)
  const gear = gearStore.state

  const gearApi: GearApi = {
    store: gearStore,

    get(id) {
      return gear[id]
    },

    add(item) {
      const newItem = { ...item, id: crypto.randomUUID() }
      gearApi.set(newItem)
      return newItem
    },

    set(...args: [ItemData] | [string, ItemData]) {
      store.setState(produce((prev) => {
        if (args.length === 1) {
          const [item] = args
          prev.gear[item.id] = item
        } else {
          const [itemId, item] = args
          prev.gear[itemId] = item
        }
      }))
    },

    getParent(itemOrId) {
      const item = gearApi.get(resolveItemId(itemOrId))
      if (!item || !item.parentId) return undefined
      return gear[item.parentId]
    },

    getChildren(itemOrId) {
      const item = gearApi.get(resolveItemId(itemOrId))
      if (!item) return []

      return (item.childIds ?? [])
        .map(gearApi.get)
        .filter((child): child is ItemData => child !== undefined)
    },

    getByType<TItem = ItemData>(itemType: string) {
      return Object.values(gear).filter(
        (item) => item.itemType === itemType,
      ) as TItem[]
    },

    addChild(parentOrId, childOrId) {
      const parent = gearApi.get(resolveItemId(parentOrId))
      const child = gearApi.get(resolveItemId(childOrId))
      if (!parent || !child) return

      store.setState(produce((prev) => {
        const childItem = prev.gear[child.id]
        childItem.parentId = parent.id

        const childIds = prev.gear[parent.id].childIds ??= []
        childIds.push(child.id)
      }))
    },

    remove(item, options = { removeChildren: false }) {
      store.setState(produce((prev) => {
        function removeItem(targetItem: ItemData) {
          delete prev.gear[targetItem.id]

          if (targetItem.parentId) {
            const parentItem = prev.gear[targetItem.parentId]
            parentItem.childIds = parentItem.childIds?.filter((id) => id !== targetItem.id)
          }
        }

        function rescursiveRemove(childItem: ItemData) {
          gearApi.getChildren(childItem).forEach(rescursiveRemove)
          removeItem(childItem)
        }

        const targetItem = typeof item === "string" ? prev.gear[item] : prev.gear[item.id]

        if (options.removeChildren) {
          rescursiveRemove(targetItem)
        } else {
          removeItem(targetItem)
        }
      }))
    },
  }

  return gearApi
}

const resolveItemId = (itemOrId: ItemData | string): string => {
  return typeof itemOrId === "string" ? itemOrId : itemOrId.id
}
