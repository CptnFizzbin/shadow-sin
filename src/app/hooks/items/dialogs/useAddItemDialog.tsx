import type { AddItemDialogOpenOptions } from "#/app/components/entities/items/addItemDialogContext.ts"
import type { AddItemSelection } from "#/app/components/entities/items/dialogs/addItemSelection.ts"
import { useAddItemTypeDialog } from "#/app/components/entities/items/dialogs/addItemTypeDialog.tsx"
import { useItemFormDialog } from "#/app/components/entities/items/dialogs/itemFormDialog.tsx"
import { useArmorFormDialog } from "#/app/components/entities/items/types/armor/dialogs/armorFormDialog.tsx"
import { useDrugFormDialog } from "#/app/components/entities/items/types/consumables/dialogs/drugFormDialog.tsx"
import { useDeviceFormDialog } from "#/app/components/entities/items/types/devices/dialogs/deviceFormDialog.tsx"
import { useImplantFormDialog } from "#/app/components/entities/items/types/implants/dialogs/implantFormDialog.tsx"
import { useLicenseFormDialog } from "#/app/components/entities/items/types/licenses/dialogs/licenseFormDialog.tsx"
import { useSinFormDialog } from "#/app/components/entities/items/types/licenses/dialogs/sinFormDialog.tsx"
import { useFocusFormDialog } from "#/app/components/entities/items/types/magical/dialogs/focusFormDialog.tsx"
import { useVehicleFormDialog } from "#/app/components/entities/items/types/vehicles/dialogs/vehicleFormDialog.tsx"
import { useWeaponFormDialog } from "#/app/components/entities/items/types/weapons/dialogs/weaponFormDialog.tsx"
import { GearSection } from "#/app/components/entities/items/viewer/gearSectionTypes.ts"
import type { UUID } from "#/common/uuid/uuidUtils.ts"
import type { ItemData } from "#/data/items/itemData.ts"
import { ItemType } from "#/data/items/itemType.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"

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
  const drugFormDialog = useDrugFormDialog()
  const focusFormDialog = useFocusFormDialog()
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
    if (selection.section === GearSection.Consumables && "consumableType" in selection) {
      // Drug is the only Consumable subtype so far.
      return drugFormDialog.open({ wizard: true, parentId })
    }
    if (selection.section === GearSection.Magical && "magicalType" in selection) {
      // Focus is the only Magical subtype so far.
      return focusFormDialog.open({ wizard: true, parentId })
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
      {drugFormDialog.outlet}
      {focusFormDialog.outlet}
      {miscFormDialog.outlet}
    </>
  )

  return { open, outlet }
}
