import type { FC } from "react"

import { GearItemsList } from "#/components/CharacterBuilder/Gear/Generic/GearItemsList.tsx"
import { useVehiclesFormGroup } from "#/components/CharacterBuilder/Gear/Vehicles/UseVehiclesFormGroup.ts"

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
