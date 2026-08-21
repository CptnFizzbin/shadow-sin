import type { Selector } from "reselect"
import { createSelector } from "reselect"

import type { Selector as StandardSelector } from "#/integrations/reselect/selectorUtils.ts"
import { createCurriedSelector } from "#/integrations/reselect/selectorUtils.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { ItemDataFor, ItemDataRecord } from "#/system/items/itemUtils.ts"
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

const legacy = {
  selectAllGear,
  selectAvailable,
  selectEquipped,
  selectStashed,
  selectById,
  selectGearOfType,
  selectChildrenOf,
  licenses,
  armor,
  implants,
  firearms,
  software,
  vehicles,
  weapons,
  devices,
  firearmAccessories,
  sins,
  credsticks,
  programs,
  other,
}

/** Standardized, namespaced selectors for the Item (gear) domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above (including the
 *  per-type groupings, nested here as sub-namespaces) — each just adapts the calling convention to
 *  `(state, options)`, reusing the same already-memoized lookups; existing call sites are
 *  unaffected. */
export namespace ItemSelectors {
  export const selectAll: StandardSelector<RunnerData, Record<string, ItemData>> = legacy.selectAllGear
  export const selectAvailable: StandardSelector<RunnerData, ItemData[]> = legacy.selectAvailable
  export const selectEquipped: StandardSelector<RunnerData, ItemData[]> = legacy.selectEquipped
  export const selectStashed: StandardSelector<RunnerData, ItemData[]> = legacy.selectStashed

  export const selectById: StandardSelector<RunnerData, ItemData, { itemId: UUID }> =
    (state, { itemId }) => legacy.selectById(itemId)(state)

  export const selectByType: StandardSelector<RunnerData, ItemDataRecord, { itemType: ItemType }> =
    (state, { itemType }) => legacy.selectGearOfType(itemType)(state)

  export const selectChildrenOf: StandardSelector<RunnerData, ItemDataRecord, { itemId: UUID }> =
    (state, { itemId }) => legacy.selectChildrenOf(itemId)(state)

  export namespace Armor {
    export const selectById: StandardSelector<RunnerData, ItemDataFor<ItemType.armor>, { itemId: UUID }> =
      (state, { itemId }) => legacy.armor.selectById(itemId)(state)
    export const selectEquipped: StandardSelector<RunnerData, ItemDataFor<ItemType.armor>[]> =
      legacy.armor.selectEquipped
  }

  export namespace Implants {
    export const selectById: StandardSelector<RunnerData, ItemDataFor<ItemType.implant>, { itemId: UUID }> =
      (state, { itemId }) => legacy.implants.selectById(itemId)(state)
  }

  export namespace Firearms {
    // Note: `ItemDataFor<ItemType.firearm>` resolves to `never` — no real `ItemData` ever has
    // `itemType: ItemType.firearm`; a Firearm is `itemType: ItemType.weapon` with
    // `weaponType: WeaponType.firearm` (see weaponData.ts). The legacy `firearms` export this
    // wraps is consequently unreachable against real data today — kept here only for structural
    // parity with the other per-type groupings, not fixed (pre-existing, out of this pass's scope).
    export const selectById: StandardSelector<RunnerData, ItemData, { itemId: UUID }> =
      (state, { itemId }) => legacy.firearms.selectById(itemId)(state)
  }

  export namespace Software {
    export const selectById: StandardSelector<RunnerData, ItemDataFor<ItemType.software>, { itemId: UUID }> =
      (state, { itemId }) => legacy.software.selectById(itemId)(state)
  }

  export namespace Vehicles {
    export const selectById: StandardSelector<RunnerData, ItemDataFor<ItemType.vehicle>, { itemId: UUID }> =
      (state, { itemId }) => legacy.vehicles.selectById(itemId)(state)
  }

  export namespace Weapons {
    export const selectById: StandardSelector<RunnerData, ItemDataFor<ItemType.weapon>, { itemId: UUID }> =
      (state, { itemId }) => legacy.weapons.selectById(itemId)(state)
  }

  export namespace Devices {
    export const selectById: StandardSelector<RunnerData, ItemDataFor<ItemType.device>, { itemId: UUID }> =
      (state, { itemId }) => legacy.devices.selectById(itemId)(state)
  }

  export namespace FirearmAccessories {
    export const selectById: StandardSelector<
      RunnerData, ItemDataFor<ItemType.firearmAccessory>, { itemId: UUID }
    > = (state, { itemId }) => legacy.firearmAccessories.selectById(itemId)(state)
  }

  export namespace Sins {
    export const selectById: StandardSelector<RunnerData, ItemDataFor<ItemType.sin>, { itemId: UUID }> =
      (state, { itemId }) => legacy.sins.selectById(itemId)(state)
  }

  export namespace Credsticks {
    export const selectById: StandardSelector<RunnerData, ItemDataFor<ItemType.credstick>, { itemId: UUID }> =
      (state, { itemId }) => legacy.credsticks.selectById(itemId)(state)
  }

  export namespace Programs {
    export const selectById: StandardSelector<RunnerData, ItemDataFor<ItemType.program>, { itemId: UUID }> =
      (state, { itemId }) => legacy.programs.selectById(itemId)(state)
  }

  export namespace Other {
    // Note: `ItemDataFor<ItemType.other>` resolves to `never` — `AnyItemData` has no dedicated
    // subtype for "other" items (they're plain `ItemData`), even though real items do carry
    // `itemType: ItemType.other`. `ItemData` is the accurate type here, not a narrower one.
    export const selectById: StandardSelector<RunnerData, ItemData, { itemId: UUID }> =
      (state, { itemId }) => legacy.other.selectById(itemId)(state)
  }

  export namespace Licenses {
    export const selectById: StandardSelector<RunnerData, LicenseData, { itemId: UUID }> =
      (state, { itemId }) => legacy.licenses.selectById(itemId)(state)
    export const selectForItem: StandardSelector<RunnerData, LicenseData | null, { itemId: UUID }> =
      (state, { itemId }) => legacy.licenses.selectForItem(itemId)(state)
    export const selectItemsForId: StandardSelector<RunnerData, ItemData[], { licenseId: UUID }> =
      (state, { licenseId }) => legacy.licenses.selectItemsForId(licenseId)(state)
  }
}
