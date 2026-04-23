import type { UUID } from "node:crypto"

import { useStore } from "@tanstack/react-store"
import type { BaseAtom } from "@tanstack/store"
import { batch, createStore } from "@tanstack/store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { selectAllGear, selectGearById, selectGearParent } from "#/components/items/gearSelectors.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ItemData } from "#/system/itemData.ts"

export interface RemoveItemOptions {
  removeChildren?: boolean
}

export interface GearStore extends BaseAtom<Record<UUID, ItemData>> {
  set(item: ItemData): ItemData

  add(item: Omit<ItemData, "id">): ItemData

  save(item: ItemData): ItemData

  remove(item: ItemData, options?: RemoveItemOptions): void

  setParent(child: ItemData, parent: ItemData): ItemData

  addChild(parent: ItemData, child: ItemData): ItemData

  /**
   * Search all gear items by name and description.
   * Each term must appear (case-insensitive substring) in the item's name or description.
   * When a child matches, its parent is also included. When a parent matches, all its
   * children are also included.
   * Returns all items if `terms` is empty.
   */
  search(terms: string[]): ItemData[]
}

export function useGearStore() {
  const store = useCharacterSheetContext()

  return useMemo(() => {
    const gearAtom = createStore(() => store.state.gear)

    const updateListLinks = (updatedItem: ItemData) => {
      store.setState(produce((prev) => {
        for (const savedItem of Object.values(prev.gear)) {
          savedItem.childIds ??= []

          if (savedItem.id === updatedItem.parentId) {
            if (!savedItem.childIds.includes(updatedItem.id)) {
              savedItem.childIds.push(updatedItem.id)
            }
          } else {
            savedItem.childIds = savedItem.childIds.filter((id) => id !== updatedItem.id)
          }

          // Only manage children's parentId when childIds is explicitly provided.
          // If childIds is absent (e.g. a form submission that does not include it),
          // leave existing children's parentId untouched to avoid detaching them.
          if (updatedItem.childIds !== undefined) {
            if (updatedItem.childIds.includes(savedItem.id)) {
              savedItem.parentId = updatedItem.id
            } else if (savedItem.parentId === updatedItem.id) {
              savedItem.parentId = undefined
            }
          }
        }
      }))
    }

    const gearStore: GearStore = {
      get: () => gearAtom.get(),
      subscribe: (listener) => gearAtom.subscribe(listener),

      add: (item) => gearStore.set({ ...item, id: crypto.randomUUID() }),
      setParent: (child, parent) => gearStore.set({ ...child, parentId: parent.id }),
      addChild: (parent, child) => gearStore.set({ ...child, parentId: parent.id }),

      save: (item) => {
        if (!item.id || item.id === NullUuid) {
          return gearStore.set({ ...item, id: crypto.randomUUID() as UUID })
        }
        return gearStore.set(item)
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

      search(terms) {
        if (terms.length === 0) return Object.values(gearStore.get())

        const allItems = Object.values(gearStore.get())
        const includedIds = new Set<string>()

        const itemMatchesTerms = (item: ItemData): boolean =>
          terms.every((term) => {
            const lowerTerm = term.toLowerCase()
            return (
              item.name.toLowerCase().includes(lowerTerm)
              || (item.description?.toLowerCase().includes(lowerTerm) ?? false)
            )
          })

        for (const item of allItems) {
          if (itemMatchesTerms(item)) {
            includedIds.add(item.id)
            // Include parent so it is visible as context
            if (item.parentId) includedIds.add(item.parentId)
            // Include all children of a directly-matching parent
            for (const childId of item.childIds ?? []) {
              includedIds.add(childId)
            }
          }
        }

        return allItems.filter((item) => includedIds.has(item.id))
      },
    }

    return gearStore
  }, [store])
}

/**
 * Reactively read a single gear item by id. Re-renders only when that item changes.
 */
export function useGearById<TItem extends ItemData>(id: UUID): TItem | undefined {
  const store = useGearStore()
  return useStore(store, selectGearById<TItem>(id))
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
  const store = useGearStore()
  return useStore(store, selectGearParent(item))
}

/**
 * Reactively read the children of a gear item. Re-renders when the gear Record changes.
 */
export function useGearChildren(item: ItemData): ItemData[] {
  const store = useGearStore()
  const gear = useStore(store, selectAllGear)
  const childIds = item.childIds ?? []
  return childIds.map((itemId) => gear[itemId])
}

export function useGearFilter<TReturn extends ItemData>(filter: (item: ItemData) => item is TReturn): TReturn[] {
  const store = useGearStore()
  const gear = useStore(store, selectAllGear)
  return Object.values(gear).filter(filter)
}
