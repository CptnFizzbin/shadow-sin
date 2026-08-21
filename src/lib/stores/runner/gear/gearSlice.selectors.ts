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

export function selectAllGear(state: RunnerData): Record<string, ItemData> {
  return state.gear
}

export function selectAvailable(state: RunnerData): ItemData[] {
  return Object.values(state.gear).filter((item) => !item.stashed)
}

export function selectEquipped(state: RunnerData): ItemData[] {
  return Object.values(state.gear).filter((item) => item.equipped)
}

export function selectStashed(state: RunnerData): ItemData[] {
  return Object.values(state.gear).filter((item) => item.stashed)
}

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

export const armor = {
  selectById: makeSelectByIdOfType(ItemType.armor),

  selectEquipped: createSelector([
    selectGearOfType(ItemType.armor),
  ], (allArmor) => {
    return Object.values(allArmor).filter((item) => item.equipped)
  }),
}

export const implants = { selectById: makeSelectByIdOfType(ItemType.implant) }
export const firearms = { selectById: makeSelectByIdOfType(ItemType.firearm) }
export const software = { selectById: makeSelectByIdOfType(ItemType.software) }
export const vehicles = { selectById: makeSelectByIdOfType(ItemType.vehicle) }
export const weapons = { selectById: makeSelectByIdOfType(ItemType.weapon) }
export const devices = { selectById: makeSelectByIdOfType(ItemType.device) }
export const firearmAccessories = { selectById: makeSelectByIdOfType(ItemType.firearmAccessory) }
export const sins = { selectById: makeSelectByIdOfType(ItemType.sin) }
export const credsticks = { selectById: makeSelectByIdOfType(ItemType.credstick) }
export const programs = { selectById: makeSelectByIdOfType(ItemType.program) }
export const other = { selectById: makeSelectByIdOfType(ItemType.other) }

/**
 * Standardized, namespaced selectors for the Item (gear) domain — see
 * docs/adr/0014-selector-input-decomposition.md. `TState` is `ItemCatalog`, deliberately narrower
 * than `RunnerData` — once 0015 Slice 5 moves `RunnerData.gear` to `RunnerData._data_.items`, a
 * caller just passes `runner._data_.items` and nothing here needs to change. Because `TState` no
 * longer carries the whole Runner, these selectors can't delegate to the legacy exports above
 * (which need a full `RunnerData`) — they reimplement the same, small filter/lookup logic directly
 * against `ItemCatalog` instead. Existing exports and call sites above are untouched.
 */
export namespace ItemSelectors {
  export const selectAll: StandardSelector<ItemCatalog, ItemCatalog> = (state) => state

  export const selectAvailable: StandardSelector<ItemCatalog, ItemData[]> = (state) =>
    Object.values(state).filter((item) => !item.stashed)

  export const selectEquipped: StandardSelector<ItemCatalog, ItemData[]> = (state) =>
    Object.values(state).filter((item) => item.equipped)

  export const selectStashed: StandardSelector<ItemCatalog, ItemData[]> = (state) =>
    Object.values(state).filter((item) => item.stashed)

  export const selectById: StandardSelector<ItemCatalog, ItemData, { itemId: UUID }> = createSelector(
    [
      (state: ItemCatalog) => state,
      (_state: ItemCatalog, options: { itemId: UUID }) => options.itemId,
    ],
    (items, itemId) => items[itemId],
  )

  export const selectByType: StandardSelector<ItemCatalog, ItemDataRecord, { itemType: ItemType }> = createSelector(
    [
      (state: ItemCatalog) => state,
      (_state: ItemCatalog, options: { itemType: ItemType }) => options.itemType,
    ],
    (items, itemType) => filterRecordByType(items, itemType),
  )

  export const selectChildrenOf: StandardSelector<ItemCatalog, ItemDataRecord, { itemId: UUID }> = createSelector(
    [
      (state: ItemCatalog) => state,
      (_state: ItemCatalog, options: { itemId: UUID }) => options.itemId,
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
    export const selectById: StandardSelector<ItemCatalog, ItemDataFor<ItemType.armor> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state, itemId, ItemType.armor)
    export const selectEquipped: StandardSelector<ItemCatalog, ItemDataFor<ItemType.armor>[]> = (state) =>
      Object.values(filterRecordByType(state, ItemType.armor)).filter((item) => item.equipped)
  }

  export namespace Implants {
    export const selectById: StandardSelector<ItemCatalog, ItemDataFor<ItemType.implant> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state, itemId, ItemType.implant)
  }

  export namespace Firearms {
    // Note: `ItemDataFor<ItemType.firearm>` resolves to `never` — no real `ItemData` ever has
    // `itemType: ItemType.firearm`; a Firearm is `itemType: ItemType.weapon` with
    // `weaponType: WeaponType.firearm` (see weaponData.ts). The legacy `firearms` export this
    // mirrors is consequently unreachable against real data today — kept here only for structural
    // parity with the other per-type groupings, not fixed (pre-existing, out of this pass's scope).
    export const selectById: StandardSelector<ItemCatalog, ItemData | undefined, { itemId: UUID }> =
      (state, { itemId }) => {
        const item = state[itemId]
        return item?.itemType === ItemType.firearm ? item : undefined
      }
  }

  export namespace Software {
    export const selectById: StandardSelector<ItemCatalog, ItemDataFor<ItemType.software> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state, itemId, ItemType.software)
  }

  export namespace Vehicles {
    export const selectById: StandardSelector<ItemCatalog, ItemDataFor<ItemType.vehicle> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state, itemId, ItemType.vehicle)
  }

  export namespace Weapons {
    export const selectById: StandardSelector<ItemCatalog, ItemDataFor<ItemType.weapon> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state, itemId, ItemType.weapon)
  }

  export namespace Devices {
    export const selectById: StandardSelector<ItemCatalog, ItemDataFor<ItemType.device> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state, itemId, ItemType.device)
  }

  export namespace FirearmAccessories {
    export const selectById: StandardSelector<
      ItemCatalog, ItemDataFor<ItemType.firearmAccessory> | undefined, { itemId: UUID }
    > = (state, { itemId }) => itemOfType(state, itemId, ItemType.firearmAccessory)
  }

  export namespace Sins {
    export const selectById: StandardSelector<ItemCatalog, ItemDataFor<ItemType.sin> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state, itemId, ItemType.sin)
  }

  export namespace Credsticks {
    export const selectById: StandardSelector<ItemCatalog, ItemDataFor<ItemType.credstick> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state, itemId, ItemType.credstick)
  }

  export namespace Programs {
    export const selectById: StandardSelector<ItemCatalog, ItemDataFor<ItemType.program> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state, itemId, ItemType.program)
  }

  export namespace Other {
    // Note: `ItemDataFor<ItemType.other>` resolves to `never` — `AnyItemData` has no dedicated
    // subtype for "other" items (they're plain `ItemData`), even though real items do carry
    // `itemType: ItemType.other`. `ItemData` is the accurate type here, not a narrower one, so this
    // doesn't use the `itemOfType` helper (which is typed for the `ItemDataFor<T>` case).
    export const selectById: StandardSelector<ItemCatalog, ItemData | undefined, { itemId: UUID }> =
      (state, { itemId }) => {
        const item = state[itemId]
        return item?.itemType === ItemType.other ? item : undefined
      }
  }

  export namespace Licenses {
    export const selectById: StandardSelector<ItemCatalog, ItemDataFor<ItemType.license> | undefined, { itemId: UUID }> =
      (state, { itemId }) => itemOfType(state, itemId, ItemType.license)

    export const selectForItem: StandardSelector<ItemCatalog, LicenseData | null, { itemId: UUID }> =
      (state, { itemId }) => {
        const item = state[itemId]
        if (!item?.licenseId) return null
        return itemOfType(state, item.licenseId, ItemType.license) ?? null
      }

    export const selectItemsForId: StandardSelector<ItemCatalog, ItemData[], { licenseId: UUID }> =
      (state, { licenseId }) => Object.values(state).filter((item) => item.licenseId === licenseId)
  }
}
