import type { UUID } from "#/utils/uuidUtils.ts"

import type { ArmorData } from "./armorData.ts"
import type { CredstickData } from "./credstickData.ts"
import type { DeviceData } from "./deviceData.ts"
import type { ImplantData } from "./implantData.ts"
import type { ItemData } from "./itemData.ts"
import type { ItemType } from "./itemType.ts"
import type { LicenseData } from "./licenseData.ts"
import type { ProgramData } from "./programData.ts"
import type { SinData } from "./sinData.ts"
import type { SoftwareData } from "./softwareData.ts"
import type { VehicleData } from "./vehicleData.ts"
import type { AnyWeaponData, FirearmAccessoryData } from "./weaponData.ts"

/**
 * The bulk item collection — `RunnerData._data_.items` (see `getItemCatalog`). This is
 * specifically the shape `ItemSelectors`'s (`gearSlice.selectors.ts`) `TState`
 * (`{ items: ItemCatalog }`) wraps — see docs/adr/0014-selector-input-decomposition.md — not just
 * "a record of items" in general.
 */
export type ItemCatalog<TData extends ItemData = ItemData> = Record<UUID, TData>

export type ItemCatalogTree = Record<UUID, { item: ItemData, children?: ItemCatalogTree }>

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
