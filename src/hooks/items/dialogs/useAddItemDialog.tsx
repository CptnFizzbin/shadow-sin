import type { AddItemDialogOpenOptions } from "#/components/entities/items/addItemDialogContext.ts"
import { useAddItemTypeDialog } from "#/components/entities/items/dialogs/addItemTypeDialog.tsx"
import { useItemFormDialog } from "#/components/entities/items/dialogs/itemFormDialog.tsx"
import { useArmorFormDialog } from "#/components/entities/items/types/armor/dialogs/armorFormDialog.tsx"
import { useDeviceFormDialog } from "#/components/entities/items/types/devices/dialogs/deviceFormDialog.tsx"
import { useImplantFormDialog } from "#/components/entities/items/types/implants/dialogs/implantFormDialog.tsx"
import { useLicenseFormDialog } from "#/components/entities/items/types/licenses/dialogs/licenseFormDialog.tsx"
import { useSinFormDialog } from "#/components/entities/items/types/licenses/dialogs/sinFormDialog.tsx"
import { useVehicleFormDialog } from "#/components/entities/items/types/vehicles/dialogs/vehicleFormDialog.tsx"
import { useWeaponFormDialog } from "#/components/entities/items/types/weapons/dialogs/weaponFormDialog.tsx"
import { GearSection } from "#/components/entities/items/viewer/gearSectionTypes.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import type { AddItemSelection } from "#/system/model/items/addItemSelection.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

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
    if (selection.section === GearSection.Weapons && "weaponType" in selection) {
      return weaponFormDialog.open({ wizard: true, weaponType: selection.weaponType, parentId })
    }
    if (selection.section === GearSection.Armor) {
      return armorFormDialog.open({ wizard: true, parentId })
    }
    if (selection.section === GearSection.Cyberware) {
      return implantFormDialog.open({ wizard: true, parentId })
    }
    if (selection.section === GearSection.Vehicles && "vehicleCategory" in selection) {
      return vehicleFormDialog.open({ wizard: true, vehicleCategory: selection.vehicleCategory, parentId })
    }
    if (selection.section === GearSection.Devices) {
      return deviceFormDialog.open({ wizard: true, parentId })
    }
    if (selection.section === GearSection.Licenses && "licenseKind" in selection) {
      return selection.licenseKind === "license"
        ? licenseFormDialog.open({ wizard: true })
        : sinFormDialog.open({ wizard: true })
    }
    return miscFormDialog.open({ wizard: true, itemType: ItemType.other, label: "Item", parentId })
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
