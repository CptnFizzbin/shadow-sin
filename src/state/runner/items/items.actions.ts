import { createAction } from "@reduxjs/toolkit"

import type { ItemBulkStateAction } from "#/system/formulas/items/itemBulkActions.ts"
import { getFocusBondingCost } from "#/system/formulas/magic/focusRules.ts"
import type { DamageTrackKey } from "#/system/model/entities/damageTrackKey.ts"
import type { ArmorData } from "#/system/model/items/armorData.ts"
import type { CredstickData } from "#/system/model/items/credstickData.ts"
import type { DeviceData } from "#/system/model/items/deviceData.ts"
import type { ImplantData } from "#/system/model/items/implantData.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import type { ItemState } from "#/system/model/items/itemState.ts"
import type { LicenseData } from "#/system/model/items/licenseData.ts"
import type { FocusData } from "#/system/model/items/magicalData.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"
import type { SinData } from "#/system/model/items/sinData.ts"
import type { SoftwareData } from "#/system/model/items/softwareData.ts"
import type { VehicleData } from "#/system/model/items/vehicleData.ts"
import type { FirearmAccessoryData, WeaponData } from "#/system/model/items/weaponData.ts"
import type { KarmaLedgerEntry } from "#/system/model/karma/karmaLedgerEntry.ts"
import type { UUID } from "#/utils/uuidUtils.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

export const addItem = createAction("gear/add", (item: Omit<ItemData, "id">) => {
  return { payload: { ...item, id: crypto.randomUUID() as UUID } }
})

export const setItem = createAction<ItemData>("gear/set")

export const patchItem = createAction<{ itemId: UUID, data: Partial<ItemData> }>("gear/patch")

export const removeItem = createAction<{ id: UUID, removeChildren?: boolean }>("gear/remove")

/**
 * Removes every Item in `ids` along with its Attachments, skipping fixed Attachments, which only
 * go when their parent does.
 */
export const removeItems = createAction<{ ids: UUID[] }>("gear/removeMany")

/**
 * Moves an Item into `state`. A state its type doesn't allow is ignored, an Attachment is capped at
 * its parent's presence, and the change cascades to its own Attachments.
 */
export const setState = createAction<{ id: UUID, state: ItemState }>("gear/setState")

/**
 * Consumes one unit of a Consumable: it becomes Active, so its Game Effects apply, and its
 * quantity drops by one. Ignored unless the Item is an Available Consumable with a unit left.
 * End the effect with `setState` back to Available.
 */
export const consumeItem = createAction<{ id: UUID }>("gear/consume")

/**
 * Applies `action` to every Item in `ids` it applies to, parents before their Attachments, silently
 * skipping the rest (e.g. Equip on an Item that can't be Equipped). Each change cascades to the
 * Item's own Attachments, the same as `setState`.
 */
export const applyBulkStateAction = createAction<{ ids: UUID[], action: ItemBulkStateAction }>("gear/applyBulkStateAction")

/**
 * Bonds a Focus to the Runner for `karmaCost` Karma, recorded on the karma ledger as `entry`. Once
 * Bonded, the Focus can be Equipped and Stashed freely. Ignored unless the Item is an unbonded
 * Focus; throws from the karma reducer when the Runner has less than `karmaCost` current Karma.
 */
export const bondFocus = createAction("gear/bondFocus", (focus: Pick<FocusData, "id" | "name" | "focusType" | "force">) => {
  const karmaCost = getFocusBondingCost(focus)
  const entry: KarmaLedgerEntry = {
    id: crypto.randomUUID() as UUID,
    timestamp: new Date().toISOString(),
    amount: -karmaCost,
    description: `Bonded ${focus.name} (${focus.focusType} Focus, Force ${focus.force})`,
    source: "bondFocus",
  }
  return { payload: { id: focus.id, karmaCost, entry } }
})

/**
 * Breaks a Focus's bond. The Karma spent Bonding it is lost, and an Equipped Focus becomes
 * Available, since an unbonded Focus can't be Equipped.
 */
export const unbondFocus = createAction<{ id: UUID }>("gear/unbondFocus")

/**
 * Sells an Item for `salePrice` nuyen, crediting it to the Runner's Nuyen. Fixed Attachments are
 * always sold with it; other Attachments are sold too when `sellAttachments` is set, and otherwise
 * stay behind as top-level Items.
 */
export const sellItem = createAction<{ id: UUID, salePrice: number, sellAttachments: boolean }>("gear/sell")

/** Sets one damage track on an item that implements `EntityWithDamage` (e.g. Agent, Vehicle) — a no-op if the item doesn't have that track. */
export const setDamage = createAction<{ itemId: UUID, track: DamageTrackKey, value: number }>("gear/setDamage")

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
  removeItems,
  setState,
  applyBulkStateAction,
  consumeItem,
  bondFocus,
  unbondFocus,
  sellItem,
  setDamage,

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
