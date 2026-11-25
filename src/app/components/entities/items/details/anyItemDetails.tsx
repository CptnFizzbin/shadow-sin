import type { FC } from "react"

import { useItemFormDialog } from "#/app/components/entities/items/dialogs/itemFormDialog.tsx"
import { ArmorItemDetails } from "#/app/components/entities/items/types/armor/armorItemDetails.tsx"
import { DrugItemDetails } from "#/app/components/entities/items/types/consumables/drugItemDetails.tsx"
import { CredstickItemDetails } from "#/app/components/entities/items/types/credsticks/credstickItemDetails.tsx"
import { AgentItemDetails } from "#/app/components/entities/items/types/devices/agentItemDetails.tsx"
import { DeviceItemDetails } from "#/app/components/entities/items/types/devices/deviceItemDetails.tsx"
import { ProgramItemDetails } from "#/app/components/entities/items/types/devices/programItemDetails.tsx"
import { ImplantItemDetails } from "#/app/components/entities/items/types/implants/implantItemDetails.tsx"
import { LicenseItemDetails } from "#/app/components/entities/items/types/licenses/licenseItemDetails.tsx"
import { SinItemDetails } from "#/app/components/entities/items/types/licenses/sinItemDetails.tsx"
import { FocusItemDetails } from "#/app/components/entities/items/types/magical/focusItemDetails.tsx"
import { VehicleItemDetails } from "#/app/components/entities/items/types/vehicles/vehicleItemDetails.tsx"
import { WeaponItemDetails } from "#/app/components/entities/items/types/weapons/weaponItemDetails.tsx"
import { isAgentData } from "#/data/items/agentData.ts"
import type { ArmorData } from "#/data/items/armorData.ts"
import { isDrugData } from "#/data/items/consumableData.ts"
import type { CredstickData } from "#/data/items/credstickData.ts"
import type { DeviceData } from "#/data/items/deviceData.ts"
import type { ImplantData } from "#/data/items/implantData.ts"
import type { ItemData } from "#/data/items/itemData.ts"
import { ItemType } from "#/data/items/itemType.ts"
import type { LicenseData } from "#/data/items/licenseData.ts"
import { isFocusData } from "#/data/items/magicalData.ts"
import type { ProgramData } from "#/data/items/programData.ts"
import type { SinData } from "#/data/items/sinData.ts"
import type { VehicleData } from "#/data/items/vehicleData.ts"
import type { WeaponData } from "#/data/items/weaponData.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"

import { ItemDetailsRoot } from "./itemDetailsRoot.tsx"

export interface AnyItemDetailsProps {
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
export const AnyItemDetails: FC<AnyItemDetailsProps> = ({ item, onRemove, onRemoved, onOpenAttachment }) => {
  const dispatch = useRunnerStoreDispatch()
  const itemFormDialog = useItemFormDialog()

  const handleEditGeneric = async () => {
    const saved = await itemFormDialog.open({ item, itemType: item.itemType })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  // Consumables dispatch on their subtype rather than `itemType` alone.
  if (isDrugData(item)) return <DrugItemDetails drug={item} onRemoved={onRemoved} />
  if (isFocusData(item)) return <FocusItemDetails focus={item} onRemoved={onRemoved} />

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
      return isAgentData(item)
        ? (
            <AgentItemDetails
              agent={item}
              onRemoved={onRemoved}
              onOpenAttachment={onOpenAttachment}
            />
          )
        : (
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
          {itemFormDialog.outlet}
        </>
      )
  }
}
