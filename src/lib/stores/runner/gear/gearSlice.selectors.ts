import { createCurriedSelector } from "#/integrations/reselect/selectorUtils.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { isAvailable, isEquipped, isStashed } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated - use {@link selectAllGear} instead **/
export function selectGear(state: RunnerData): Record<string, ItemData> {
  return state.gear
}

export function selectAllGear(state: RunnerData): Record<string, ItemData> {
  return state.gear
}

export function selectAvailable(state: RunnerData): ItemData[] {
  return Object.values(state.gear).filter(isAvailable)
}

export function selectEquipped(state: RunnerData): ItemData[] {
  return Object.values(state.gear).filter(isEquipped)
}

export function selectStashed(state: RunnerData): ItemData[] {
  return Object.values(state.gear).filter(isStashed)
}

export const selectById = createCurriedSelector(
  [
    selectAllGear,
    (_, id: UUID) => id,
  ],
  (gear, id) => gear[id],
)

export const selectGearOfType = createCurriedSelector(
  [
    selectAllGear,
    (_, type: ItemType) => type,
  ],
  (allGear, type) => {
    const licenses: Record<UUID, ItemData> = {}

    for (const gear of Object.values(allGear)) {
      if (gear.itemType === type) {
        licenses[gear.id] = gear
      }
    }

    return licenses
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

export const armor = { selectById: makeSelectByIdOfType(ItemType.armor) }
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
