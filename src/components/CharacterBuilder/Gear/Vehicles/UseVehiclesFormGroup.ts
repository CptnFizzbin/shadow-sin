import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useBuilderGearSlice } from "#/components/CharacterBuilder/Gear/UseBuilderGearSlice.ts"

export function useVehiclesFormGroup() {
  const gear = useBuilderGearSlice()
  const vehicles = gear.getItemsByType<GearItemFormState>("vehicles")

  const addVehicle = (item: Omit<GearItemFormState, "id">) => {
    gear.createItem({ ...item, type: "vehicles" })
  }

  const updateVehicle = (item: GearItemFormState) => {
    gear.saveItem({ ...item, type: "vehicles" })
  }

  const removeVehicle = (item: GearItemFormState) => {
    gear.deleteItem({ id: item.id }, { removeChildren: true })
  }

  return {
    vehicles,
    addVehicle,
    updateVehicle,
    removeVehicle,
  }
}
