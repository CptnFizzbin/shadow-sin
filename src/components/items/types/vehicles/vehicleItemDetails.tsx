import type { FC } from "react"

import { ItemDetailsRoot } from "#/components/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#/components/items/details/itemDetailsSlot.tsx"
import { useItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import type { ItemData } from "#/system/itemData.ts"

import { useVehicleFormDialog } from "./dialogs/vehicleFormDialog.tsx"

export interface VehicleItemDetailsProps {
  vehicle: VehicleData
  onRemoved?: () => void
  /** Called with an attached mod when its subitem card is tapped, to navigate to its own details page. */
  onOpenAttachment?: (item: ItemData) => void
}

export const VehicleItemDetails: FC<VehicleItemDetailsProps> = ({ vehicle, onRemoved, onOpenAttachment }) => {
  const dispatch = useRunnerStoreDispatch()
  const vehicleFormDialog = useVehicleFormDialog()
  const modFormDialog = useItemFormDialog()
  const mods = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(vehicle.id))
  const damageMax = 8 + Math.ceil(vehicle.body / 2)

  const removeVehicle = () => {
    dispatch(Actions.item.removeItem({ id: vehicle.id, removeChildren: true }))
    onRemoved?.()
  }

  const handleDamageChange = (physical: number) => {
    const updated: VehicleData = { ...vehicle, damage: { physical } }
    dispatch(Actions.item.setItem(updated))
  }

  const handleEdit = async () => {
    const saved = await vehicleFormDialog.open({ vehicle })
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  const handleAddMod = async () => {
    const saved = await modFormDialog.open({ label: "Equipment" })
    if (saved) dispatch(Actions.gear.addItem({ ...saved, parentId: vehicle.id }))
  }

  return (
    <>
      <ItemDetailsRoot
        item={vehicle}
        type={vehicle.vehicleType}
        onEdit={handleEdit}
        onRemove={removeVehicle}
        onAddSubitem={handleAddMod}
      >
        <ItemDetailsSlot.Stat label="Handling" value={vehicle.handling} type="rating" />
        <ItemDetailsSlot.Stat label="Accel" value={vehicle.accel} type="rating" />
        <ItemDetailsSlot.Stat label="Speed" value={vehicle.speed} type="rating" />
        <ItemDetailsSlot.Stat label="Sensor" value={vehicle.sensor} type="rating" />
        <ItemDetailsSlot.Stat label="Armor" value={vehicle.armor} type="rating" />
        <ItemDetailsSlot.Stat label="Body" value={vehicle.body} type="rating" />

        <ItemDetailsSlot.DamageTrack
          label="Physical"
          max={damageMax}
          current={vehicle.damage?.physical ?? 0}
          onChange={handleDamageChange}
        />

        {Object.values(mods).map((mod) => (
          <ItemDetailsSlot.Subitem
            key={mod.id}
            item={mod}
            onOpen={onOpenAttachment ? () => onOpenAttachment(mod) : undefined}
          />
        ))}
      </ItemDetailsRoot>

      {vehicleFormDialog.dialog}
      {modFormDialog.dialog}
    </>
  )
}
