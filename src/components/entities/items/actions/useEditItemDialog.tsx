import { useItemFormDialog } from "#/components/entities/items/dialogs/itemFormDialog.tsx"
import { useArmorFormDialog } from "#/components/entities/items/types/armor/dialogs/armorFormDialog.tsx"
import { useDrugFormDialog } from "#/components/entities/items/types/consumables/dialogs/drugFormDialog.tsx"
import { useCredstickDialog } from "#/components/entities/items/types/credsticks/credstickDialog.tsx"
import { useAgentFormDialog } from "#/components/entities/items/types/devices/dialogs/agentFormDialog.tsx"
import { useDeviceFormDialog } from "#/components/entities/items/types/devices/dialogs/deviceFormDialog.tsx"
import { useProgramFormDialog } from "#/components/entities/items/types/devices/dialogs/programFormDialog.tsx"
import { useImplantFormDialog } from "#/components/entities/items/types/implants/dialogs/implantFormDialog.tsx"
import { useLicenseFormDialog } from "#/components/entities/items/types/licenses/dialogs/licenseFormDialog.tsx"
import { useSinFormDialog } from "#/components/entities/items/types/licenses/dialogs/sinFormDialog.tsx"
import { useFocusFormDialog } from "#/components/entities/items/types/magical/dialogs/focusFormDialog.tsx"
import { useVehicleFormDialog } from "#/components/entities/items/types/vehicles/dialogs/vehicleFormDialog.tsx"
import { useWeaponFormDialog } from "#/components/entities/items/types/weapons/dialogs/weaponFormDialog.tsx"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { isAgentData } from "#/system/model/items/agentData.ts"
import type { ArmorData } from "#/system/model/items/armorData.ts"
import { isDrugData } from "#/system/model/items/consumableData.ts"
import type { CredstickData } from "#/system/model/items/credstickData.ts"
import type { DeviceData } from "#/system/model/items/deviceData.ts"
import type { ImplantData } from "#/system/model/items/implantData.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { LicenseData } from "#/system/model/items/licenseData.ts"
import { isFocusData } from "#/system/model/items/magicalData.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"
import type { SinData } from "#/system/model/items/sinData.ts"
import type { VehicleData } from "#/system/model/items/vehicleData.ts"
import type { WeaponData } from "#/system/model/items/weaponData.ts"

/**
 * Opens the edit form that matches an Item's type and saves the result, so any Item can be
 * edited without the caller knowing which form it needs. Render `outlet` once.
 */
export function useEditItemDialog() {
  const dispatch = useRunnerStoreDispatch()
  const allItems = useRunnerSelector(ItemSelectors.selectAll)

  const weaponFormDialog = useWeaponFormDialog()
  const armorFormDialog = useArmorFormDialog()
  const deviceFormDialog = useDeviceFormDialog()
  const programFormDialog = useProgramFormDialog()
  const agentFormDialog = useAgentFormDialog()
  const implantFormDialog = useImplantFormDialog()
  const vehicleFormDialog = useVehicleFormDialog()
  const sinFormDialog = useSinFormDialog()
  const licenseFormDialog = useLicenseFormDialog()
  const credstickDialog = useCredstickDialog()
  const drugFormDialog = useDrugFormDialog()
  const focusFormDialog = useFocusFormDialog()
  const itemFormDialog = useItemFormDialog()

  const openForm = (item: ItemData): Promise<ItemData | undefined> => {
    // The switch narrows `item.itemType`, not `item`, since ItemData isn't a discriminated union
    // of the per-type interfaces; each case match guarantees its cast is safe.
    switch (item.itemType) {
      case ItemType.weapon:
        return weaponFormDialog.open({ weapon: item as WeaponData })
      case ItemType.armor:
        return armorFormDialog.open({ armor: item as ArmorData })
      case ItemType.device:
        return deviceFormDialog.open({ device: item as DeviceData })
      case ItemType.program:
        return isAgentData(item)
          ? agentFormDialog.open({ agent: item })
          : programFormDialog.open({ program: item as ProgramData })
      case ItemType.implant:
        return implantFormDialog.open({ implant: item as ImplantData })
      case ItemType.vehicle:
        return vehicleFormDialog.open({ vehicle: item as VehicleData })
      case ItemType.sin:
        return sinFormDialog.open({ sin: item as SinData })
      case ItemType.license: {
        const sin = item.items.parentId ? allItems[item.items.parentId] as SinData | undefined : undefined
        return licenseFormDialog.open({ sin, license: item as LicenseData })
      }
      case ItemType.consumable:
        if (isDrugData(item)) return drugFormDialog.open({ drug: item })
        return itemFormDialog.open({ item, itemType: item.itemType, label: "Item" })
      case ItemType.magical:
        if (isFocusData(item)) return focusFormDialog.open({ focus: item })
        return itemFormDialog.open({ item, itemType: item.itemType, label: "Item" })
      default:
        return itemFormDialog.open({ item, itemType: item.itemType, label: "Item" })
    }
  }

  const open = async (item: ItemData) => {
    // The credstick dialog saves its own changes, since editing one can move nuyen too.
    if (item.itemType === ItemType.credstick) {
      await credstickDialog.open({ mode: "edit", credstick: item as CredstickData })
      return
    }

    const saved = await openForm(item)
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return {
    open,
    outlet: (
      <>
        {weaponFormDialog.outlet}
        {armorFormDialog.outlet}
        {deviceFormDialog.outlet}
        {programFormDialog.outlet}
        {agentFormDialog.outlet}
        {implantFormDialog.outlet}
        {vehicleFormDialog.outlet}
        {sinFormDialog.outlet}
        {licenseFormDialog.outlet}
        {credstickDialog.outlet}
        {drugFormDialog.outlet}
        {focusFormDialog.outlet}
        {itemFormDialog.outlet}
      </>
    ),
  }
}
