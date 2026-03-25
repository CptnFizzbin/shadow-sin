import type { StoreSlice } from "#/integrations/tanstack-store/StoreUtils.ts"
import type { ItemData } from "#/lib/system/types/ItemData.ts"

export interface GearApi {
  all(): Record<string, ItemData>
  get(id: string): ItemData | undefined
  set(item: ItemData): void
  getParent(item: ItemData): ItemData | undefined
  getChildren(item: ItemData): ItemData[]
  getByType<TItem = ItemData>(itemType: string): TItem[]
  addChild(parent: ItemData, child: ItemData): void
  create(item: Omit<ItemData, "id">): string
  remove(id: string, options?: { removeChildren?: boolean }): void
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

    getByType<TItem = ItemData>(itemType: string) {
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

    create(item) {
      const id = crypto.randomUUID()
      gearSlice.update((draft) => {
        draft[id] = { ...item, id }
      })
      return id
    },

    remove(id, options) {
      gearSlice.update((draft) => {
        if (options?.removeChildren) {
          const stack: string[] = [id]
          while (stack.length) {
            const current = stack.pop()
            if (!current) continue
            for (const [key, value] of Object.entries(draft)) {
              if (value.parentId === current) stack.push(key)
            }
            delete draft[current]
          }
        } else {
          delete draft[id]
        }
      })
    },
  }
}
