import type { FC } from "react"

import { GearItemsList } from "#/components/Character/Form/Gear/Generic/GearItemsList.tsx"
import { useVehiclesFormGroup } from "#/components/Character/Form/Gear/Vehicles/UseVehiclesFormGroup.ts"

export const VehiclesPanel: FC = () => {
  const { vehicles, addVehicle, updateVehicle, removeVehicle } =
    useVehiclesFormGroup()

  return (
    <GearItemsList
      items={vehicles}
      onAdd={addVehicle}
      onUpdate={updateVehicle}
      onRemove={removeVehicle}
      label="Vehicle"
    />
  )
}
