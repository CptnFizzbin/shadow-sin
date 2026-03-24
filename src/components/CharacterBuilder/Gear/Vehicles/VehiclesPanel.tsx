import type { FC } from "react"

import { GearItemsList } from "#/components/CharacterBuilder/Gear/Generic/GearItemsList.tsx"
import { useVehiclesState } from "#/components/CharacterBuilder/Gear/Vehicles/UseVehiclesState.ts"

export const VehiclesPanel: FC = () => {
  const { vehicles, addVehicle, updateVehicle, removeVehicle } =
    useVehiclesState()

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
