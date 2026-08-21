import type { Selector } from "reselect"
import { createSelector } from "reselect"

import type { Selector as StandardSelector } from "#/integrations/reselect/selectorUtils.ts"
import { createCurriedSelector } from "#/integrations/reselect/selectorUtils.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { ItemCatalog, ItemDataFor, ItemDataRecord } from "#/system/items/itemUtils.ts"
import { filterRecordByType, itemIsType } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `ItemSelectors.selectAll` instead. */
export function selectAllGear(state: RunnerData): Record<string, ItemData> {
  return state.gear
}

/** @deprecated Use `ItemSelectors.selectAvailable` instead. */
export function selectAvailable(state: RunnerData): ItemData[] {
  return Object.values(state.gear).filter((item) => !item.stashed)
}

/** @deprecated Use `ItemSelectors.selectEquipped` instead. */
export function selectEquipped(state: RunnerData): ItemData[] {
  return Object.values(state.gear).filter((item) => item.equipped)
}

/** @deprecated Use `ItemSelectors.selectStashed` instead. */
export function selectStashed(state: RunnerData): ItemData[] {
  return Object.values(state.gear).filter((item) => item.stashed)
}

/** @deprecated Use `ItemSelectors.selectById` instead. */
export const selectById: (id: UUID) => Selector<RunnerData, ItemData> = createCurriedSelector(
  [
    selectAllGear,
    (_: RunnerData, id: UUID) => id,
  ],
  (gear, id) => gear[id],
)

type ItemDataSelector<TData extends ItemData> = Selector<
  RunnerData,
  Record<UUID, TData>
>

const gearSelectorsByType: Partial<Record<
  ItemType,
  ItemDataSelector<ItemData>
>> = {}

/** @deprecated Use `ItemSelectors.selectByType` instead. */
export const selectGearOfType = <T extends ItemType>(type: T): ItemDataSelector<ItemDataFor<T>> => {
  if (gearSelectorsByType) {
    gearSelectorsByType[type] = createSelector(
      [
        selectAllGear,
      ],
      (allGear) => {
        const filteredEntries = Object.entries(allGear)
          .filter(([_id, item]) => item.itemType === type)

        return Object.fromEntries(filteredEntries)
      },
    )
  }

  return gearSelectorsByType[type] as ItemDataSelector<ItemDataFor<T>>
}

/** @deprecated Use `ItemSelectors.selectChildrenOf` instead. */
export const selectChildrenOf: (itemId: UUID) => Selector<RunnerData, ItemDataRecord> = createCurriedSelector(
  [
    selectAllGear,
    (state, itemId: UUID) => selectById(itemId)(state),
  ],
  (allGear, parentItem) => {
    const children: ItemDataRecord = {}

    for (const childId of parentItem.childIds ?? []) {
      children[childId] = allGear[childId]
    }

    return children
  },
)

/** @deprecated Use `ItemSelectors.Licenses` instead. */
export const licenses = {
  selectById: createCurriedSelector(
    [
      selectGearOfType(ItemType.license),
      (_, id) => id,
    ],
    (licenseGear, id) => licenseGear[id],
  ),

  selectForItem: createCurriedSelector(
    [
      selectGearOfType(ItemType.license),
      (state, itemId: UUID) => selectById(itemId)(state),
    ],
    (licenseGear, item): null | LicenseData => {
      if (!item?.licenseId) return null
      return licenseGear[item.licenseId]
    },
  ),

  selectItemsForId: createCurriedSelector(
    [
      selectAllGear,
      (_, licenseId: UUID) => licenseId,
    ],
    (allGear, licenseId) => {
      return Object.values(allGear)
        .filter((item) => item.licenseId === licenseId)
    },
  ),
}

function makeSelectByIdOfType(type: ItemType) {
  return createCurriedSelector(
    [
      selectGearOfType(type),
      (_, id: UUID) => id,
    ],
    (itemsOfType, id) => itemsOfType[id],
  )
}

/** @deprecated Use `ItemSelectors.Armor` instead. */
export const armor = {
  selectById: makeSelectByIdOfType(ItemType.armor),

  selectEquipped: createSelector([
    selectGearOfType(ItemType.armor),
  ], (allArmor) => {
    return Object.values(allArmor).filter((item) => item.equipped)
  }),
}

/** @deprecated Use `ItemSelectors.Implants` instead. */
export const implants = { selectById: makeSelectByIdOfType(ItemType.implant) }
/** @deprecated Use `ItemSelectors.Firearms` instead. */
export const firearms = { selectById: makeSelectByIdOfType(ItemType.firearm) }
/** @deprecated Use `ItemSelectors.Software` instead. */
export const software = { selectById: makeSelectByIdOfType(ItemType.software) }
/** @deprecated Use `ItemSelectors.Vehicles` instead. */
export const vehicles = { selectById: makeSelectByIdOfType(ItemType.vehicle) }
/** @deprecated Use `ItemSelectors.Weapons` instead. */
export const weapons = { selectById: makeSelectByIdOfType(ItemType.weapon) }
/** @deprecated Use `ItemSelectors.Devices` instead. */
export const devices = { selectById: makeSelectByIdOfType(ItemType.device) }
/** @deprecated Use `ItemSelectors.FirearmAccessories` instead. */
export const firearmAccessories = { selectById: makeSelectByIdOfType(ItemType.firearmAccessory) }
/** @deprecated Use `ItemSelectors.Sins` instead. */
export const sins = { selectById: makeSelectByIdOfType(ItemType.sin) }
/** @deprecated Use `ItemSelectors.Credsticks` instead. */
export const credsticks = { selectById: makeSelectByIdOfType(ItemType.credstick) }
/** @deprecated Use `ItemSelectors.Programs` instead. */
export const programs = { selectById: makeSelectByIdOfType(ItemType.program) }
/** @deprecated Use `ItemSelectors.Other` instead. */
export const other = { selectById: makeSelectByIdOfType(ItemType.other) }

/**
 * Standardized, namespaced selectors for the Item (gear) domain — see
 * docs/adr/0014-selector-input-decomposition.md. `TState` is the inline object type
 * `{ items: ItemCatalog }`, deliberately narrower than `RunnerData` — once 0015 Slice 5 moves
 * `RunnerData.gear` to `RunnerData._data_.items`, a caller just passes `{ items: runner._data_.items }`
 * and nothing here needs to change. Because `TState` no longer carries the whole Runner, these
 * selectors can't delegate to the legacy exports above (which need a full `RunnerData`) — they
 * reimplement the same, small filter/lookup logic directly against `ItemCatalog` instead. Existing
 * exports and call sites above are untouched.
 */
export namespace ItemSelectors {
  export const selectAll: StandardSelector<{ items: ItemCatalog }, ItemCatalog> = (state) => state.items

  export const selectAvailable: StandardSelector<{ items: ItemCatalog }, ItemData[]> = (state) =>
    Object.values(state.items).filter((item) => !item.stashed)

  export const selectEquipped: StandardSelector<{ items: ItemCatalog }, ItemData[]> = (state) =>
    Object.values(state.items).filter((item) => item.equipped)

  export const selectStashed: StandardSelector<{ items: ItemCatalog }, ItemData[]> = (state) =>
    Object.values(state.items).filter((item) => item.stashed)

  export const selectById: StandardSelector<{ items: ItemCatalog }, ItemData, { itemId: UUID }> = createSelector(
    [
      (state: { items: ItemCatalog }) => state.items,
      (_state: { items: ItemCatalog }, options: { itemId: UUID }) => options.itemId,
    ],
    (items, itemId) => items[itemId],
  )

  export const selectByType: StandardSelector<{ items: ItemCatalog }, ItemDataRecord, { itemType: ItemType }> = createSelector(
    [
      (state: { items: ItemCatalog }) => state.items,
      (_state: { items: ItemCatalog }, options: { itemType: ItemType }) => options.itemType,
    ],
    (items, itemType) => filterRecordByType(items, itemType),
  )

  export const selectChildrenOf: StandardSelector<{ items: ItemCatalog }, ItemDataRecord, { itemId: UUID }> = createSelector(
    [
      (state: { items: ItemCatalog }) => state.items,
      (_state: { items: ItemCatalog }, options: { itemId: UUID }) => options.itemId,
    ],
    (items, itemId) => {
      const parent = items[itemId]
      const children: ItemDataRecord = {}

      for (const childId of parent?.childIds ?? []) {
        children[childId] = items[childId]
      }

      return children
    },
  )

  /** Shared by every per-type sub-namespace below: looks the item up by id first (cheaper than
   *  filtering the whole catalog by type), then confirms it's actually of `type` via the same type
   *  guard `filterRecordByType` uses. */
  function itemOfType<T extends ItemType>(items: ItemCatalog, itemId: UUID, type: T): ItemDataFor<T> | undefined {
    const item = items[itemId]
    return item !== undefined && itemIsType(item, type) ? item : undefined
  }

  export namespace Armor {
    export const selectById: StandardSelector<{ items: ItemCatalog }, ItemDataFor<ItemType.armor> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state.items, itemId, ItemType.armor)
    export const selectEquipped: StandardSelector<{ items: ItemCatalog }, ItemDataFor<ItemType.armor>[]> = (state) =>
      Object.values(filterRecordByType(state.items, ItemType.armor)).filter((item) => item.equipped)
  }

  export namespace Implants {
    export const selectById: StandardSelector<{ items: ItemCatalog }, ItemDataFor<ItemType.implant> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state.items, itemId, ItemType.implant)
  }

  export namespace Firearms {
    // Note: `ItemDataFor<ItemType.firearm>` resolves to `never` — no real `ItemData` ever has
    // `itemType: ItemType.firearm`; a Firearm is `itemType: ItemType.weapon` with
    // `weaponType: WeaponType.firearm` (see weaponData.ts). The legacy `firearms` export this
    // mirrors is consequently unreachable against real data today — kept here only for structural
    // parity with the other per-type groupings, not fixed (pre-existing, out of this pass's scope).
    export const selectById: StandardSelector<{ items: ItemCatalog }, ItemData | undefined, { itemId: UUID }> =
      (state, { itemId }) => {
        const item = state.items[itemId]
        return item?.itemType === ItemType.firearm ? item : undefined
      }
  }

  export namespace Software {
    export const selectById: StandardSelector<{ items: ItemCatalog }, ItemDataFor<ItemType.software> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state.items, itemId, ItemType.software)
  }

  export namespace Vehicles {
    export const selectById: StandardSelector<{ items: ItemCatalog }, ItemDataFor<ItemType.vehicle> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state.items, itemId, ItemType.vehicle)
  }

  export namespace Weapons {
    export const selectById: StandardSelector<{ items: ItemCatalog }, ItemDataFor<ItemType.weapon> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state.items, itemId, ItemType.weapon)
  }

  export namespace Devices {
    export const selectById: StandardSelector<{ items: ItemCatalog }, ItemDataFor<ItemType.device> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state.items, itemId, ItemType.device)
  }

  export namespace FirearmAccessories {
    export const selectById: StandardSelector<
      { items: ItemCatalog }, ItemDataFor<ItemType.firearmAccessory> | undefined, { itemId: UUID }
    > = (state, { itemId }) => itemOfType(state.items, itemId, ItemType.firearmAccessory)
  }

  export namespace Sins {
    export const selectById: StandardSelector<{ items: ItemCatalog }, ItemDataFor<ItemType.sin> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state.items, itemId, ItemType.sin)
  }

  export namespace Credsticks {
    export const selectById: StandardSelector<{ items: ItemCatalog }, ItemDataFor<ItemType.credstick> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state.items, itemId, ItemType.credstick)
  }

  export namespace Programs {
    export const selectById: StandardSelector<{ items: ItemCatalog }, ItemDataFor<ItemType.program> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state.items, itemId, ItemType.program)
  }

  export namespace Other {
    // Note: `ItemDataFor<ItemType.other>` resolves to `never` — `AnyItemData` has no dedicated
    // subtype for "other" items (they're plain `ItemData`), even though real items do carry
    // `itemType: ItemType.other`. `ItemData` is the accurate type here, not a narrower one, so this
    // doesn't use the `itemOfType` helper (which is typed for the `ItemDataFor<T>` case).
    export const selectById: StandardSelector<{ items: ItemCatalog }, ItemData | undefined, { itemId: UUID }> =
      (state, { itemId }) => {
        const item = state.items[itemId]
        return item?.itemType === ItemType.other ? item : undefined
      }
  }

  export namespace Licenses {
    export const selectById: StandardSelector<{ items: ItemCatalog }, ItemDataFor<ItemType.license> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state.items, itemId, ItemType.license)

    export const selectForItem: StandardSelector<{ items: ItemCatalog }, LicenseData | null, { itemId: UUID }> =
      (state, { itemId }) => {
        const item = state.items[itemId]
        if (!item?.licenseId) return null
        return itemOfType(state.items, item.licenseId, ItemType.license) ?? null
      }

    export const selectItemsForId: StandardSelector<{ items: ItemCatalog }, ItemData[], { licenseId: UUID }> =
      (state, { licenseId }) => Object.values(state.items).filter((item) => item.licenseId === licenseId)
  }
}
