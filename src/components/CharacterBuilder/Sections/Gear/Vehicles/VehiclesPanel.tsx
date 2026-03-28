import type { FC } from "react"

import { GearItemsList } from "#/components/CharacterBuilder/Sections/Gear/Generic/GearItemsList.tsx"
import { useVehiclesState } from "#/components/CharacterBuilder/Sections/Gear/Vehicles/UseVehiclesState.ts"

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
