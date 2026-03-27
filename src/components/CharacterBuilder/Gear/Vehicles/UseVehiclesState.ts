import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useGearApi, useGearByType } from "#/components/Gear/UseGearApi.ts"

export function useVehiclesState() {
  const gear = useGearApi()
  const vehicles = useGearByType<GearItemFormState>("vehicles")

  const addVehicle = (item: Omit<GearItemFormState, "id">) => {
    gear.add({ ...item, itemType: "vehicles" })
  }

  const updateVehicle = (item: GearItemFormState) => {
    gear.set({ ...item, itemType: "vehicles" })
  }

  const removeVehicle = (item: GearItemFormState) => {
    gear.remove(item.id, { removeChildren: true })
  }

  return {
    vehicles,
    addVehicle,
    updateVehicle,
    removeVehicle,
  }
}
