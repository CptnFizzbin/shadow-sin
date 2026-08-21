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

export type ItemDataRecord<TData extends ItemData = ItemData> = Record<UUID, TData>

/**
 * The bulk item collection — what `RunnerData.gear` is today, and what
 * `docs/features/0015-entity-interface-decomposition.md` Slice 5 moves to `RunnerData._data_.items`.
 * Named separately from `ItemDataRecord` because this is specifically the selector-layer `TState`
 * value (see `ItemsState` below and docs/adr/0014-selector-input-decomposition.md), not just "a
 * record of items" in general.
 */
export type ItemCatalog = ItemDataRecord

/**
 * The `TState` shape for `ItemSelectors` (`gearSlice.selectors.ts`) — an `ItemCatalog` wrapped
 * under a named key, deliberately narrower than `RunnerState` (`{ runner: RunnerData }`). Once
 * 0015 Slice 5 lands, a caller passes `{ items: state.runner._data_.items }` and nothing about
 * `ItemSelectors`'s own accessors or combiners needs to change.
 */
export interface ItemsState {
  items: ItemCatalog
}

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
  items: ItemDataRecord<TInput>,
  filterFn: (item: TInput) => item is TOutput,
): ItemDataRecord<TOutput> {
  const filteredEntires = Object.entries(items)
    .filter(([_id, item]) => filterFn(item))

  return Object.fromEntries(filteredEntires) as ItemDataRecord<TOutput>
}

export function filterRecordByType<
  TItemType extends ItemType,
  TInput extends ItemData = ItemData,
>(
  items: ItemDataRecord<TInput>,
  type: TItemType,
): ItemDataRecord<ItemDataFor<TItemType>> {
  return filterRecordBy(items, (item) => {
    return itemIsType(item, type)
  })
}

export const ItemUtils = {
  filterRecordBy,
  filterRecordByType,
}
