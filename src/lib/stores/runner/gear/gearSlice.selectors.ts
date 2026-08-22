import type { Selector } from "reselect"

import type { Selector as StandardSelector } from "#/integrations/reselect/selectorUtils.ts"
import {
  createCurriedSelector,
  createMemoizedSelector,
  createSelector,
  selectorOption,
} from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { ItemCatalog, ItemCatalogTree, ItemDataFor, ItemDataRecord } from "#/system/items/itemUtils.ts"
import { filterRecordByType, itemIsType } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `ItemSelectors.selectAll` via `useRunnerSelector` instead. */
export function selectAllGear(state: RunnerData): Record<string, ItemData> {
  return state._data_.items
}

/** @deprecated Use `ItemSelectors.selectAvailable` via `useRunnerSelector` instead. */
export function selectAvailable(state: RunnerData): ItemData[] {
  return Object.values(state._data_.items).filter((item) => !item.stashed)
}

/** @deprecated Use `ItemSelectors.selectEquipped` via `useRunnerSelector` instead. */
export function selectEquipped(state: RunnerData): ItemData[] {
  return Object.values(state._data_.items).filter((item) => item.equipped)
}

/** @deprecated Use `ItemSelectors.selectStashed` via `useRunnerSelector` instead. */
export function selectStashed(state: RunnerData): ItemData[] {
  return Object.values(state._data_.items).filter((item) => item.stashed)
}

/** @deprecated Use `ItemSelectors.selectById` via `useRunnerSelector` instead. */
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

/** @deprecated Use `ItemSelectors.selectByType` via `useRunnerSelector` instead. */
export const selectGearOfType = <T extends ItemType>(type: T): ItemDataSelector<ItemDataFor<T>> => {
  if (gearSelectorsByType) {
    gearSelectorsByType[type] = createMemoizedSelector(
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

/** @deprecated Use `ItemSelectors.selectChildrenOf` via `useRunnerSelector` instead. */
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

/** @deprecated Use `ItemSelectors.Licenses` via `useRunnerSelector` instead. */
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

/** @deprecated Use `ItemSelectors.Armor` via `useRunnerSelector` instead. */
export const armor = {
  selectById: makeSelectByIdOfType(ItemType.armor),

  selectEquipped: createMemoizedSelector([
    selectGearOfType(ItemType.armor),
  ], (allArmor) => {
    return Object.values(allArmor).filter((item) => item.equipped)
  }),
}

/** @deprecated Use `ItemSelectors.Implants` via `useRunnerSelector` instead. */
export const implants = { selectById: makeSelectByIdOfType(ItemType.implant) }
/** @deprecated Use `ItemSelectors.Firearms` via `useRunnerSelector` instead. */
export const firearms = { selectById: makeSelectByIdOfType(ItemType.firearm) }
/** @deprecated Use `ItemSelectors.Software` via `useRunnerSelector` instead. */
export const software = { selectById: makeSelectByIdOfType(ItemType.software) }
/** @deprecated Use `ItemSelectors.Vehicles` via `useRunnerSelector` instead. */
export const vehicles = { selectById: makeSelectByIdOfType(ItemType.vehicle) }
/** @deprecated Use `ItemSelectors.Weapons` via `useRunnerSelector` instead. */
export const weapons = { selectById: makeSelectByIdOfType(ItemType.weapon) }
/** @deprecated Use `ItemSelectors.Devices` via `useRunnerSelector` instead. */
export const devices = { selectById: makeSelectByIdOfType(ItemType.device) }
/** @deprecated Use `ItemSelectors.FirearmAccessories` via `useRunnerSelector` instead. */
export const firearmAccessories = { selectById: makeSelectByIdOfType(ItemType.firearmAccessory) }
/** @deprecated Use `ItemSelectors.Sins` via `useRunnerSelector` instead. */
export const sins = { selectById: makeSelectByIdOfType(ItemType.sin) }
/** @deprecated Use `ItemSelectors.Credsticks` via `useRunnerSelector` instead. */
export const credsticks = { selectById: makeSelectByIdOfType(ItemType.credstick) }
/** @deprecated Use `ItemSelectors.Programs` via `useRunnerSelector` instead. */
export const programs = { selectById: makeSelectByIdOfType(ItemType.program) }
/** @deprecated Use `ItemSelectors.Other` via `useRunnerSelector` instead. */
export const other = { selectById: makeSelectByIdOfType(ItemType.other) }

export namespace ItemSelectors {
  export type ItemSelector<TReturn, TOptions extends object | never = never> = StandardSelector<
    { items: ItemCatalog }, TReturn, TOptions
  >

  export const Options = {
    itemId: selectorOption<{ itemId: UUID }>("itemId"),
    itemType: selectorOption<{ itemType: ItemType }>("itemType"),
    licenseId: selectorOption<{ licenseId: UUID }>("licenseId"),
  }

  export const selectAll = createSelector(
    ViewerStateSelectors.selectItems,
  ) satisfies ItemSelector<ItemCatalog>

  export const selectAllTree = createSelector(
    ViewerStateSelectors.selectItems,
    toItemCatalogTree,
  ) satisfies ItemSelector<ItemCatalogTree>

  export const selectAvailable = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    (items) => Object.values(items).filter((item) => !item.stashed),
  ) satisfies ItemSelector<ItemData[]>

  export const selectEquipped = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    (items) => Object.values(items).filter((item) => item.equipped),
  ) satisfies ItemSelector<ItemData[]>

  export const selectStashed = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    (items) => Object.values(items).filter((item) => item.stashed),
  ) satisfies ItemSelector<ItemData[]>

  export const selectById = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    Options.itemId,
    (items, itemId) => items[itemId],
  ) satisfies ItemSelector<ItemData, { itemId: UUID }>

  export const selectByType = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    Options.itemType,
    (items, itemType) => filterRecordByType(items, itemType),
  ) satisfies ItemSelector<ItemCatalog, { itemType: ItemType }>

  export const selectChildrenOf = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    Options.itemId,
    (items, itemId) => {
      const parent = items[itemId]
      const children: ItemCatalog = {}

      for (const childId of parent?.childIds ?? []) {
        children[childId] = items[childId]
      }

      return children
    },
  ) satisfies ItemSelector<ItemCatalog, { itemId: UUID }>

  /**
   * The item at `itemId`, narrowed to `type` — `undefined` if no such item exists or it isn't of
   * that type. Shared by every per-type sub-namespace below.
   */
  function itemOfType<T extends ItemType>(items: ItemCatalog, itemId: UUID, type: T): ItemDataFor<T> | undefined {
    const item = items[itemId]
    return item !== undefined && itemIsType(item, type) ? item : undefined
  }

  export namespace Armor {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      Options.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.armor),
    ) satisfies ItemSelector<ItemDataFor<ItemType.armor> | undefined, { itemId: UUID }>

    export const selectEquipped = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      (items) => Object.values(filterRecordByType(items, ItemType.armor)).filter((item) => item.equipped),
    ) satisfies ItemSelector<ItemDataFor<ItemType.armor>[]>
  }

  export namespace Implants {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      Options.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.implant),
    ) satisfies ItemSelector<ItemDataFor<ItemType.implant> | undefined, { itemId: UUID }>
  }

  export namespace Software {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      Options.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.software),
    ) satisfies ItemSelector<ItemDataFor<ItemType.software> | undefined, { itemId: UUID }>
  }

  export namespace Vehicles {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      Options.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.vehicle),
    ) satisfies ItemSelector<ItemDataFor<ItemType.vehicle> | undefined, { itemId: UUID }>
  }

  export namespace Weapons {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      Options.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.weapon),
    ) satisfies ItemSelector<ItemDataFor<ItemType.weapon> | undefined, { itemId: UUID }>
  }

  export namespace Devices {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      Options.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.device),
    ) satisfies ItemSelector<ItemDataFor<ItemType.device> | undefined, { itemId: UUID }>
  }

  export namespace FirearmAccessories {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      Options.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.firearmAccessory),
    ) satisfies ItemSelector<ItemDataFor<ItemType.firearmAccessory> | undefined, { itemId: UUID }>
  }

  export namespace Sins {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      Options.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.sin),
    ) satisfies ItemSelector<ItemDataFor<ItemType.sin> | undefined, { itemId: UUID }>
  }

  export namespace Credsticks {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      Options.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.credstick),
    ) satisfies ItemSelector<ItemDataFor<ItemType.credstick> | undefined, { itemId: UUID }>
  }

  export namespace Programs {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      Options.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.program),
    ) satisfies ItemSelector<ItemDataFor<ItemType.program> | undefined, { itemId: UUID }>
  }

  export namespace Other {
    // Note: `ItemDataFor<ItemType.other>` resolves to `never` — `AnyItemData` has no dedicated
    // subtype for "other" items (they're plain `ItemData`), even though real items do carry
    // `itemType: ItemType.other`. `ItemData` is the accurate type here, not a narrower one, so this
    // doesn't use the `itemOfType` helper (which is typed for the `ItemDataFor<T>` case).
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      Options.itemId,
      (items, itemId) => {
        const item = items[itemId]
        return item?.itemType === ItemType.other ? item : undefined
      },
    ) satisfies ItemSelector<ItemData | undefined, { itemId: UUID }>
  }

  export namespace Licenses {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      Options.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.license),
    ) satisfies ItemSelector<ItemDataFor<ItemType.license> | undefined, { itemId: UUID }>

    export const selectForItem = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      Options.itemId,
      (items, itemId) => {
        const item = items[itemId]
        if (!item?.licenseId) return null
        return itemOfType(items, item.licenseId, ItemType.license) ?? null
      },
    ) satisfies ItemSelector<LicenseData | null, { itemId: UUID }>

    export const selectItemsForId = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      Options.licenseId,
      (items, licenseId) => Object.values(items).filter((item) => item.licenseId === licenseId),
    ) satisfies ItemSelector<ItemData[], { licenseId: UUID }>
  }
}
