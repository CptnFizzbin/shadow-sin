import type { Store } from "@tanstack/store"
import { produce } from "immer"

import type { ItemData } from "#/lib/system/ItemData.ts"

export interface RemoveItemOptions {
  removeChildren?: boolean
}

export interface GearApi {
  get(id: string): ItemData | undefined

  set(item: ItemData): void

  set(itemId: string, item: ItemData): void

  add(item: Omit<ItemData, "id">): ItemData

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

export function createGearApi<TState extends { gear: Record<string, ItemData> }>(
  store: Store<TState>,
): GearApi {
  const gearApi: GearApi = {
    get(id) {
      return store.state.gear[id]
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
      return store.state.gear[item.parentId]
    },

    getChildren(itemOrId) {
      const item = gearApi.get(resolveItemId(itemOrId))
      if (!item) return []

      return (item.childIds ?? [])
        .map((id) => store.state.gear[id])
        .filter((child): child is ItemData => child !== undefined)
    },

    getByType<TItem = ItemData>(itemType: string) {
      return Object.values(store.state.gear).filter(
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
            if (parentItem) {
              parentItem.childIds = parentItem.childIds?.filter((id) => id !== targetItem.id)
            }
          }
        }

        function recursiveRemove(itemId: string) {
          const targetItem = prev.gear[itemId]
          if (!targetItem) return

          for (const childId of targetItem.childIds ?? []) {
            recursiveRemove(childId)
          }

          removeItem(targetItem)
        }

        const targetId = typeof item === "string" ? item : item.id
        const targetItem = prev.gear[targetId]
        if (!targetItem) return

        if (options.removeChildren) {
          recursiveRemove(targetId)
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
