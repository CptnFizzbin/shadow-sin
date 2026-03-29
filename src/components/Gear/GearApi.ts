import type { UUID } from "node:crypto"

import type { BaseAtom, Store } from "@tanstack/store"
import { batch, createStore } from "@tanstack/store"
import { produce } from "immer"

import type { ItemData } from "#/lib/system/ItemData.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export interface RemoveItemOptions {
  removeChildren?: boolean
}

export interface GearApi extends BaseAtom<Record<UUID, ItemData>> {
  set(item: ItemData): ItemData

  add(item: Omit<ItemData, "id">): ItemData

  remove(item: ItemData, options?: RemoveItemOptions): void

  setParent(child: ItemData, parent: ItemData): ItemData

  addChild(parent: ItemData, child: ItemData): ItemData
}

export function createGearApi(store: Store<CharacterSheet>): GearApi {
  const gearStore = createStore(() => store.state.gear)

  const updateListLinks = (updatedItem: ItemData) => {
    store.setState(produce((prev) => {
      for (const savedItem of Object.values(prev.gear)) {
        savedItem.childIds ??= []
        if (savedItem.id === updatedItem.parentId) {
          if (!savedItem.childIds.includes(updatedItem.id)) {
            savedItem.childIds.push(savedItem.id)
          }
        } else {
          savedItem.childIds = savedItem.childIds.filter((id) => id !== updatedItem.id)
        }

        updatedItem.childIds ??= []
        if (updatedItem.childIds.includes(savedItem.id)) {
          savedItem.parentId = updatedItem.id
        } else {
          if (savedItem.parentId === updatedItem.id) {
            savedItem.parentId = undefined
          }
        }
      }
    }))
  }

  const gearApi: GearApi = {
    get() {
      return gearStore.get()
    },

    subscribe(listener) {
      return gearStore.subscribe(listener)
    },

    add(item) {
      return gearApi.set({ ...item, id: crypto.randomUUID() })
    },

    setParent(child, parent) {
      return gearApi.set({ ...child, parentId: parent.id })
    },

    addChild(parent, child) {
      return gearApi.set({ ...child, parentId: parent.id })
    },

    set(item) {
      batch(() => {
        store.setState(produce((prev) => {
          prev.gear[item.id] = item
        }))

        updateListLinks(item)
      })

      return item
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

        function recursiveRemove(targetItem: ItemData) {
          for (const childId of targetItem.childIds ?? []) {
            const childItem = prev.gear[childId]
            recursiveRemove(childItem)
          }

          removeItem(targetItem)
        }

        const targetItem = prev.gear[item.id]
        if (!targetItem) return

        if (options.removeChildren) {
          recursiveRemove(targetItem)
        } else {
          removeItem(targetItem)
        }
      }))
    },
  }

  return gearApi
}
