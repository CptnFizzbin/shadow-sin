import type { FC } from "react"

import { BasicItemDetails } from "#/components/items/details/basicItemDetails.tsx"
import { ItemDetailsSlot } from "#/components/items/details/itemDetailsSlot.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"

import { useVehicleFormDialog } from "./dialogs/vehicleFormDialog.tsx"

export interface VehicleItemDetailsProps {
  vehicle: VehicleData
  onRemoved?: () => void
}

export const VehicleItemDetails: FC<VehicleItemDetailsProps> = ({ vehicle, onRemoved }) => {
  const dispatch = useRunnerStoreDispatch()
  const vehicleFormDialog = useVehicleFormDialog()
  const damageMax = vehicle.damage?.physical.max || vehicle.body

  const removeVehicle = () => {
    dispatch(Actions.gear.removeItem({ id: vehicle.id, removeChildren: true }))
    onRemoved?.()
  }

  const handleDamageChange = (current: number) => {
    const updated: VehicleData = { ...vehicle, damage: { physical: { current, max: damageMax } } }
    dispatch(Actions.gear.setItem(updated))
  }

  const handleEdit = async () => {
    const saved = await vehicleFormDialog.open({ vehicle })
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  return (
    <>
      <BasicItemDetails item={vehicle} type={vehicle.vehicleType} onEdit={handleEdit} onRemove={removeVehicle}>
        <ItemDetailsSlot.Stat label="Handling" value={vehicle.handling} type="rating" />
        <ItemDetailsSlot.Stat label="Acceleration" value={vehicle.accel} type="rating" />
        <ItemDetailsSlot.Stat label="Speed" value={vehicle.speed} type="rating" />
        <ItemDetailsSlot.Stat label="Armor" value={vehicle.armor} type="damage" />
        <ItemDetailsSlot.Stat label="Body" value={vehicle.body} type="damage" />

        <ItemDetailsSlot.DamageTrack
          label="Damage"
          max={damageMax}
          current={vehicle.damage?.physical.current ?? 0}
          onChange={handleDamageChange}
        />
      </BasicItemDetails>

      {vehicleFormDialog.dialog}
    </>
  )
}
