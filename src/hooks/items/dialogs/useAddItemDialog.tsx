import { useAddItemTypeDialog } from "#/components/items/dialogs/addItemTypeDialog.tsx"
import { useItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { useArmorFormDialog } from "#/components/items/types/armor/dialogs/armorFormDialog.tsx"
import { useDeviceFormDialog } from "#/components/items/types/devices/dialogs/deviceFormDialog.tsx"
import { useImplantFormDialog } from "#/components/items/types/implants/dialogs/implantFormDialog.tsx"
import { useLicenseFormDialog } from "#/components/items/types/licenses/dialogs/licenseFormDialog.tsx"
import { useSinFormDialog } from "#/components/items/types/licenses/dialogs/sinFormDialog.tsx"
import { useVehicleFormDialog } from "#/components/items/types/vehicles/dialogs/vehicleFormDialog.tsx"
import { useWeaponFormDialog } from "#/components/items/types/weapons/dialogs/weaponFormDialog.tsx"
import { GearSection } from "#/components/runner/gearPage/gearSectionTypes.ts"
import type { AddItemDialogOpenOptions } from "#/contexts/items/addItemDialogContext.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import { isNewItem } from "#/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { AddItemSelection } from "#/system/items/addItemSelection.ts"

/**
 * Drives the Add Item workflow end to end: Select Type / Select Subtype (via
 * `useAddItemTypeDialog`, itself an `AddItemTypeWorkflow`), then the resolved gear
 * type's own Enter Stats / Select Effects / Finalize dialog (each `use*FormDialog` in
 * `wizard` mode, driven by `ItemDialog`'s own `ItemDialogWizard`), then saves the
 * result to the runner. Render `outlet` once and call `open()` from an "Add Item" trigger.
 */
export function useAddItemDialog() {
  const dispatch = useRunnerStoreDispatch()

  const typeDialog = useAddItemTypeDialog()
  const weaponFormDialog = useWeaponFormDialog()
  const armorFormDialog = useArmorFormDialog()
  const implantFormDialog = useImplantFormDialog()
  const vehicleFormDialog = useVehicleFormDialog()
  const deviceFormDialog = useDeviceFormDialog()
  const sinFormDialog = useSinFormDialog()
  const licenseFormDialog = useLicenseFormDialog()
  const miscFormDialog = useItemFormDialog()

  const openTargetDialog = (selection: AddItemSelection, parentId?: UUID): Promise<ItemData | undefined> => {
    switch (selection.section) {
      case GearSection.Weapons:
        return weaponFormDialog.open({ wizard: true, weaponType: selection.weaponType, parentId })
      case GearSection.Armor:
        return armorFormDialog.open({ wizard: true, parentId })
      case GearSection.Cyberware:
        return implantFormDialog.open({ wizard: true, parentId })
      case GearSection.Vehicles:
        return vehicleFormDialog.open({ wizard: true, vehicleCategory: selection.vehicleCategory, parentId })
      case GearSection.Devices:
        return deviceFormDialog.open({ wizard: true, parentId })
      case GearSection.Licenses:
        return selection.licenseKind === "license"
          ? licenseFormDialog.open({ wizard: true })
          : sinFormDialog.open({ wizard: true })
      default:
        return miscFormDialog.open({ wizard: true, itemType: ItemType.other, label: "Item", parentId })
    }
  }

  const open = async (options?: AddItemDialogOpenOptions) => {
    const selection = await typeDialog.open()
    if (!selection) return

    const saved = await openTargetDialog(selection, options?.parentId)
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  const outlet = (
    <>
      {typeDialog.outlet}
      {weaponFormDialog.outlet}
      {armorFormDialog.outlet}
      {implantFormDialog.outlet}
      {vehicleFormDialog.outlet}
      {deviceFormDialog.outlet}
      {sinFormDialog.outlet}
      {licenseFormDialog.outlet}
      {miscFormDialog.outlet}
    </>
  )

  return { open, outlet }
}
