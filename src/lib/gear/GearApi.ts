import type { StoreSlice } from "#/integrations/tanstack-store/StoreUtils.ts"
import type { ItemData } from "#/lib/system/types/ItemData.ts"

export interface GearApi {
  all(): Record<string, ItemData>
  get(id: string): ItemData | undefined
  set(item: ItemData): void
  getParent(item: ItemData): ItemData | undefined
  getChildren(item: ItemData): ItemData[]
  getByType<TItem extends ItemData>(itemType: string): TItem[]
  addChild(parent: ItemData, child: ItemData): void
}

export function createGearApi(
  gearSlice: StoreSlice<Record<string, ItemData>>,
): GearApi {
  return {
    all() {
      return gearSlice.state
    },

    get(id) {
      return gearSlice.state[id]
    },

    set(item) {
      gearSlice.update((draft) => {
        draft[item.id] = item
      })
    },

    getParent(item) {
      if (!item.parentId) return undefined
      return gearSlice.state[item.parentId]
    },

    getChildren(item) {
      return (item.childIds ?? [])
        .map((id) => gearSlice.state[id])
        .filter((child): child is ItemData => child !== undefined)
    },

    getByType<TItem extends ItemData>(itemType: string) {
      return Object.values(gearSlice.state).filter(
        (item) => item.itemType === itemType,
      ) as TItem[]
    },

    addChild(parent, child) {
      gearSlice.update((draft) => {
        draft[child.id] = { ...child, parentId: parent.id }
        const draftParent = draft[parent.id]
        if (draftParent) {
          draftParent.childIds = [...(draftParent.childIds ?? []), child.id]
        }
      })
    },
  }
}
