import type { UUID } from "node:crypto"

import { useStore } from "@tanstack/react-store"
import type { BaseAtom } from "@tanstack/store"
import { batch, createStore } from "@tanstack/store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/character-sheet-provider.tsx"
import type { ItemData } from "#/lib/system/item-data.ts"

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

export function useGearApi() {
  const store = useCharacterSheetContext()

  return useMemo(() => {
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
      get: () => gearStore.get(),
      subscribe: (listener) => gearStore.subscribe(listener),

      add: (item) => gearApi.set({ ...item, id: crypto.randomUUID() }),
      setParent: (child, parent) => gearApi.set({ ...child, parentId: parent.id }),
      addChild: (parent, child) => gearApi.set({ ...child, parentId: parent.id }),

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
  }, [store])
}

/**
 * Reactively read a single gear item by id. Re-renders only when that item changes.
 */
export function useGearById<TItem extends ItemData>(id: UUID): TItem | undefined {
  const api = useGearApi()
  return useStore(api, (gear) => gear[id] as TItem | undefined)
}

/**
 * Reactively read all gear items of a given itemType.
 * Subscribes to the gear Record; re-renders when any gear changes.
 * The React Compiler memoizes the filter result based on the stable `gear` reference.
 */
export function useGearByType<TItem extends ItemData>(itemType: string): TItem[] {
  return useGearFilter((item): item is TItem => item.itemType === itemType)
}

/**
 * Reactively read the parent of a gear item. Re-renders only when that parent item reference changes.
 */
export function useGearParent(item: ItemData): ItemData | undefined {
  const api = useGearApi()
  return useStore(api, (gear) => {
    if (!item || !item.parentId) return undefined
    return gear[item.parentId]
  })
}

/**
 * Reactively read the children of a gear item. Re-renders when the gear Record changes.
 */
export function useGearChildren(item: ItemData): ItemData[] {
  const api = useGearApi()
  const gear = useStore(api, (items) => items)
  const childIds = item.childIds ?? []
  return childIds.map((itemId) => gear[itemId])
}

export function useGearFilter<TReturn extends ItemData>(filter: (item: ItemData) => item is TReturn): TReturn[] {
  const api = useGearApi()
  const gear = useStore(api, (g) => g)
  return Object.values(gear).filter(filter)
}
