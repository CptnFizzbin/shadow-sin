import type { FC } from "react"

import { useItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { ArmorItemDetails } from "#/components/items/types/armor/armorItemDetails.tsx"
import { CredstickItemDetails } from "#/components/items/types/credsticks/credstickItemDetails.tsx"
import { DeviceItemDetails } from "#/components/items/types/devices/deviceItemDetails.tsx"
import { ProgramItemDetails } from "#/components/items/types/devices/programItemDetails.tsx"
import { ImplantItemDetails } from "#/components/items/types/implants/implantItemDetails.tsx"
import { LicenseItemDetails } from "#/components/items/types/licenses/licenseItemDetails.tsx"
import { SinItemDetails } from "#/components/items/types/licenses/sinItemDetails.tsx"
import { VehicleItemDetails } from "#/components/items/types/vehicles/vehicleItemDetails.tsx"
import { WeaponItemDetails } from "#/components/items/types/weapons/weaponItemDetails.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import type { CredstickData } from "#/system/gear/credstickData.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { ProgramData } from "#/system/gear/programData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { ItemDetailsRoot } from "./itemDetailsRoot.tsx"

export interface ItemDetailsProps {
  item: ItemData
  /**
   * Remove action for item types without a typed details view (the
   * ItemDetailsRoot fallback). Ignored by typed views, which manage
   * removal internally — call `onRemoved` to be notified when that happens.
   */
  onRemove?: () => void
  /**
   * Called after a typed details view removes the item internally (e.g. so
   * the route can navigate back). Ignored by the ItemDetailsRoot fallback,
   * which calls `onRemove` directly instead.
   */
  onRemoved?: () => void
  /** Called with an attached item when its nested subitem card is tapped, to navigate to that item's own details page. */
  onOpenAttachment?: (item: ItemData) => void
}

/**
 * Renders the typed details view for `item.itemType`, falling back to
 * `ItemDetailsRoot` (common fields only, no type-specific slots) for item
 * types without one yet. Mirrors `AnyItemCard`'s dispatcher — this is the only
 * module allowed to depend on every typed details view; typed views must
 * depend on `ItemDetailsRoot`/`ItemDetailsSlot` instead of this file, or
 * importing it here would create a cycle.
 *
 * Typed views own their own edit-dialog wiring internally (each opens its
 * matching `use*FormDialog()` hook), the same way they already own their own
 * removal — there's no list context above them to supply it, unlike
 * `AnyItemCard`. Only the fallback path needs one supplied here, via the
 * generic `useItemFormDialog()`.
 */
export const ItemDetails: FC<ItemDetailsProps> = ({ item, onRemove, onRemoved, onOpenAttachment }) => {
  const dispatch = useRunnerStoreDispatch()
  const itemFormDialog = useItemFormDialog()

  const handleEditGeneric = async () => {
    const saved = await itemFormDialog.open({ item, itemType: item.itemType })
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  switch (item.itemType) {
    case ItemType.weapon:
      return (
        <WeaponItemDetails
          weapon={item as WeaponData}
          onRemoved={onRemoved}
          onOpenAttachment={onOpenAttachment}
        />
      )
    case ItemType.armor:
      return (
        <ArmorItemDetails
          armor={item as ArmorData}
          onRemoved={onRemoved}
          onOpenAttachment={onOpenAttachment}
        />
      )
    case ItemType.license:
      return (
        <LicenseItemDetails
          license={item as LicenseData}
          onRemoved={onRemoved}
        />
      )
    case ItemType.sin:
      return (
        <SinItemDetails
          sin={item as SinData}
          onRemoved={onRemoved}
          onOpenAttachment={onOpenAttachment}
        />
      )
    case ItemType.credstick:
      return (
        <CredstickItemDetails
          credstick={item as CredstickData}
        />
      )
    case ItemType.device:
      return (
        <DeviceItemDetails
          device={item as DeviceData}
          onRemoved={onRemoved}
          onOpenAttachment={onOpenAttachment}
        />
      )
    case ItemType.program:
      return (
        <ProgramItemDetails
          program={item as ProgramData}
          onRemoved={onRemoved}
        />
      )
    case ItemType.implant:
      return (
        <ImplantItemDetails
          implant={item as ImplantData}
          onRemoved={onRemoved}
          onOpenAttachment={onOpenAttachment}
        />
      )
    case ItemType.vehicle:
      return (
        <VehicleItemDetails
          vehicle={item as VehicleData}
          onRemoved={onRemoved}
          onOpenAttachment={onOpenAttachment}
        />
      )
    default:
      return (
        <>
          <ItemDetailsRoot item={item} onEdit={handleEditGeneric} onRemove={onRemove} />
          {itemFormDialog.dialog}
        </>
      )
  }
}
