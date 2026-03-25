import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useBuilderGearApi } from "#/components/CharacterBuilder/Gear/UseBuilderGearApi.ts"

export function useVehiclesState() {
  const gear = useBuilderGearApi()
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
