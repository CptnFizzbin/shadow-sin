import type { StoreSlice } from "#/integrations/tanstack-store/StoreUtils.ts"
import type { GearData, GearType } from "#/lib/system/types/gear/gearData.ts"

/** The shape of the gear field on CharacterSheet. */
export type GearSlice = Record<string, GearData>

/**
 * CRUD interface for the flat gear record on a CharacterSheet.
 *
 * Read operations return values from the current snapshot; write operations
 * (`set` / `remove`) mutate via the underlying Immer store slice so that
 * subscribers receive reactive updates.
 */
export interface GearApi {
  /** All gear items as an array. */
  allItems(): GearData[]
  /** Returns items that match the given predicate. */
  findItems(predicate: (item: GearData) => boolean): GearData[]
  /** Returns the item with the given id, or `undefined` if absent. */
  getItem(id: string): GearData | undefined
  /** Returns the parent of `item` (via `item.parentId`), or `undefined`. */
  getParent(item: GearData): GearData | undefined
  /** Returns all items whose `parentId` equals `parentId`. */
  getChildren(parentId: string): GearData[]
  /** Adds a new item or replaces an existing one (keyed by `item.id`). */
  set(item: GearData): void
  /** Removes the item with the given id from the record. */
  remove(id: string): void
  /** Returns all items whose `type` equals `type`, narrowed to `T`. */
  findByType<TGear extends GearData>(type: GearType | string): TGear[]
}

/**
 * Creates a `GearApi` bound to a reactive `StoreSlice<GearSlice>`.
 *
 * The slice is read at call time so `allItems`, `findItems`, etc. always
 * reflect the latest snapshot. `set` and `remove` propagate changes through
 * Immer so the store stays consistent.
 */
export function createGearApi(slice: StoreSlice<GearSlice>): GearApi {
  const read = (): GearSlice => slice.state

  return {
    allItems(): GearData[] {
      return Object.values(read())
    },

    findItems(predicate: (item: GearData) => boolean): GearData[] {
      return Object.values(read()).filter(predicate)
    },

    getItem(id: string): GearData | undefined {
      return read()[id]
    },

    getParent(item: GearData): GearData | undefined {
      if (!item.parentId) return undefined
      return read()[item.parentId]
    },

    getChildren(parentId: string): GearData[] {
      return Object.values(read()).filter((item) => item.parentId === parentId)
    },

    set(item: GearData): void {
      slice.update((draft) => {
        draft[item.id] = item as GearData
      })
    },

    remove(id: string): void {
      slice.update((draft) => {
        delete draft[id]
      })
    },

    findByType<TGear extends GearData>(type: GearType | string): TGear[] {
      return Object.values(read()).filter(
        (item) => item.type === type,
      ) as TGear[]
    },
  }
}
