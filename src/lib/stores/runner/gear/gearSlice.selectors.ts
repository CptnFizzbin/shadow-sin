import type { Selector } from "reselect"
import { createSelector } from "reselect"

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
