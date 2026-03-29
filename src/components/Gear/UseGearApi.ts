import type { UUID } from "node:crypto"

import { useStore } from "@tanstack/react-store"
import { useContext } from "react"

import { GearContext } from "#/components/Gear/GearProvider.tsx"
import type { ItemData } from "#/lib/system/ItemData.ts"

export function useGearApi() {
  const api = useContext(GearContext)

  if (!api) {
    throw new Error("useGearApi must be used within a GearProvider")
  }

  return api
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
