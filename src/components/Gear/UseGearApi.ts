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
export function useGearItem(id: string): ItemData | undefined {
  const api = useGearApi()
  return useStore(api.store, (gear) => gear[id])
}

/**
 * Reactively read all gear items of a given itemType.
 * Subscribes to the gear Record; re-renders when any gear changes.
 * The React Compiler memoizes the filter result based on the stable `gear` reference.
 */
export function useGearByType<TItem = ItemData>(itemType: string): TItem[] {
  const api = useGearApi()
  const gear = useStore(api.store, (g) => g)
  return Object.values(gear).filter((item) => item.itemType === itemType) as TItem[]
}

/**
 * Reactively read the parent of a gear item. Re-renders only when that parent item reference changes.
 */
export function useGearParent(itemOrId: ItemData | string): ItemData | undefined {
  const api = useGearApi()
  const id = resolveItemId(itemOrId)
  return useStore(api.store, (gear) => {
    const item = gear[id]
    if (!item || !item.parentId) return undefined
    return gear[item.parentId]
  })
}

/**
 * Reactively read the children of a gear item. Re-renders when the gear Record changes.
 */
export function useGearChildren(itemOrId: ItemData | string): ItemData[] {
  const api = useGearApi()
  const id = resolveItemId(itemOrId)

  return useStore(api.store, (gear) => {
    const item = gear[id]
    if (!item) return []
    return (item.childIds ?? [])
      .map((childId) => gear[childId])
      .filter((child): child is ItemData => child !== undefined)
  })
}

const resolveItemId = (itemOrId: ItemData | string): string => {
  return typeof itemOrId === "string" ? itemOrId : itemOrId.id
}
