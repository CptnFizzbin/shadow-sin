import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { ItemData } from "#/system/itemData.ts"
import type { ItemType } from "#/system/itemType.ts"

/**
 * @deprecated Use `useRunnerSelector(({ item }) => item.byType(itemType))` instead — see
 * `docs/adr/0013-unify-runner-state-access.md`.
 */
export function useGearByType<TItem extends ItemData>(itemType: ItemType): TItem[] {
  return useGearFilter((item): item is TItem => item.itemType === itemType)
}

export function useGearFilter<TReturn extends ItemData>(filter: (item: ItemData) => item is TReturn): TReturn[] {
  const gear = useRunnerStoreSelector(Selectors.gear.selectAllGear)
  return Object.values(gear).filter(filter)
}

/**
 * Search all gear items by name and description.
 * Each term must appear (case-insensitive substring) in the item's name or description.
 * When a child matches, its parent is also included. When a parent matches, all its
 * children are also included. Returns all items if `terms` is empty.
 */
export function searchGear(gear: Record<string, ItemData>, terms: string[]): ItemData[] {
  const allItems = Object.values(gear)
  if (terms.length === 0) return allItems

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
      if (item.parentId) includedIds.add(item.parentId)
      for (const childId of item.childIds ?? []) {
        includedIds.add(childId)
      }
    }
  }

  return allItems.filter((item) => includedIds.has(item.id))
}
