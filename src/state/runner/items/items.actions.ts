import { createAction } from "@reduxjs/toolkit"

import type { ArmorData } from "#/system/model/items/armorData.ts"
import type { CredstickData } from "#/system/model/items/credstickData.ts"
import type { DeviceData } from "#/system/model/items/deviceData.ts"
import type { ImplantData } from "#/system/model/items/implantData.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import type { LicenseData } from "#/system/model/items/licenseData.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"
import type { SinData } from "#/system/model/items/sinData.ts"
import type { SoftwareData } from "#/system/model/items/softwareData.ts"
import type { VehicleData } from "#/system/model/items/vehicleData.ts"
import type { FirearmAccessoryData, WeaponData } from "#/system/model/items/weaponData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

export const addItem = createAction("gear/add", (item: Omit<ItemData, "id">) => {
  return { payload: { ...item, id: crypto.randomUUID() as UUID } }
})

export const setItem = createAction<ItemData>("gear/set")

export const patchItem = createAction<{ itemId: UUID, data: Partial<ItemData> }>("gear/patch")

export const removeItem = createAction<{ id: UUID, removeChildren?: boolean }>("gear/remove")

export const setEquipped = createAction<{ id: UUID, equipped: boolean }>("gear/setEquipped")

export const setStashed = createAction<{ id: UUID, stashed: boolean }>("gear/setStashed")

/** Lets a caller decide whether to dispatch `addItem` or `setItem` for a save. */
export function isNewItem(item: ItemData): boolean {
  return !item.id || item.id === NullUuid
}

export const licenses = {
  create: (license: Omit<LicenseData, "id">) => {
    return addItem(license)
  },

  destroy: (licenseId: LicenseData["id"]) => {
    return removeItem({ id: licenseId })
  },

  setLicenseForItem: ({ itemId, licenseId }: { itemId: UUID, licenseId: UUID }) => {
    return patchItem({ itemId, data: { licenseId } })
  },

  clearLicenseForItem: ({ itemId }: { itemId: UUID }) => {
    return patchItem({ itemId, data: { licenseId: null } })
  },
}

function makeTypeActions<TItem extends ItemData>() {
  return {
    create: (item: Omit<TItem, "id">) => {
      return addItem(item)
    },

    destroy: (id: TItem["id"]) => {
      return removeItem({ id })
    },
  }
}

export const armor = makeTypeActions<ArmorData>()
export const implants = makeTypeActions<ImplantData>()
export const firearms = makeTypeActions<ItemData>()
export const software = makeTypeActions<SoftwareData>()
export const vehicles = makeTypeActions<VehicleData>()
export const weapons = makeTypeActions<WeaponData>()
export const devices = makeTypeActions<DeviceData>()
export const firearmAccessories = makeTypeActions<FirearmAccessoryData>()
export const sins = makeTypeActions<SinData>()
export const credsticks = makeTypeActions<CredstickData>()
export const programs = makeTypeActions<ProgramData>()
export const other = makeTypeActions<ItemData>()

export const ItemActions = {
  addItem,
  setItem,
  patchItem,
  removeItem,
  setEquipped,
  setStashed,

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
