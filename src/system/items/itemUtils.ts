import type { UUID } from "#/lib/uuidUtils.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import type { CredstickData } from "#/system/gear/credstickData.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { ProgramData } from "#/system/gear/programData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import type { SoftwareData } from "#/system/gear/softwareData.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import type { AnyWeaponData, FirearmAccessoryData } from "#/system/gear/weaponData.ts"
import type { ItemData } from "#/system/itemData.ts"
import type { ItemType } from "#/system/itemType.ts"

/**
 * The bulk item collection — what `RunnerData.gear` is today, and what
 * `docs/features/0015-entity-interface-decomposition.md` Slice 5 moves to `RunnerData._data_.items`.
 * This is specifically the shape `ItemSelectors`'s (`gearSlice.selectors.ts`) `TState`
 * (`{ items: ItemCatalog }`) wraps — see docs/adr/0014-selector-input-decomposition.md — not just
 * "a record of items" in general. Once Slice 5 lands, a caller passes
 * `{ items: runner._data_.items }` and nothing about `ItemSelectors`'s own accessors or combiners
 * needs to change.
 */
export type ItemCatalog<TData extends ItemData = ItemData> = Record<UUID, TData>

export type ItemCatalogTree = Record<UUID, { item: ItemData, children?: ItemCatalogTree }>

export function toItemCatalogTree(catalog: ItemCatalog): ItemCatalogTree {
  const isRoot = (item: ItemData) => item.parentId === undefined || !(item.parentId in catalog)

  const buildNode = (id: UUID): [UUID, ItemCatalogTree[UUID]] => {
    const item = catalog[id]
    const childIds = item.childIds?.filter((childId) => childId in catalog) ?? []

    return childIds.length > 0
      ? [id, { item, children: Object.fromEntries(childIds.map(buildNode)) }]
      : [id, { item }]
  }

  const rootIds = (Object.keys(catalog) as UUID[]).filter((id) => isRoot(catalog[id]))

  return Object.fromEntries(rootIds.map(buildNode))
}

/** @deprecated Use {@link ItemCatalog} instead. */
export type ItemDataRecord = ItemCatalog

export type AnyItemData =
  | ArmorData
  | AnyWeaponData
  | ImplantData
  | DeviceData
  | VehicleData
  | SoftwareData
  | LicenseData
  | FirearmAccessoryData
  | SinData
  | CredstickData
  | ProgramData

export type ItemDataFor<T extends ItemType> = Extract<AnyItemData, { itemType: T }>

export function itemIsType<
  TItemType extends ItemType,
>(item: ItemData, type: TItemType): item is ItemDataFor<TItemType> {
  return item.itemType === type
}

export function filterRecordBy<TInput extends ItemData = ItemData, TOutput extends TInput = TInput>(
  items: ItemCatalog<TInput>,
  filterFn: (item: TInput) => item is TOutput,
): ItemCatalog<TOutput> {
  const filteredEntires = Object.entries(items)
    .filter(([_id, item]) => filterFn(item))

  return Object.fromEntries(filteredEntires) as ItemCatalog<TOutput>
}

export function filterRecordByType<
  TItemType extends ItemType,
  TInput extends ItemData = ItemData,
>(
  items: ItemCatalog<TInput>,
  type: TItemType,
): ItemCatalog<ItemDataFor<TItemType>> {
  return filterRecordBy(items, (item) => {
    return itemIsType(item, type)
  })
}

export const ItemUtils = {
  filterRecordBy,
  filterRecordByType,
}
