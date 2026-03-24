import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { GearData } from "#/lib/system/types/gear/gearData.ts"

export function useVehiclesFormGroup() {
  const itemsSlice = useCharacterBuilderStoreSlice(
    (state) => state.gear.vehicles,
    (state, vehicles) => {
      state.gear.vehicles = vehicles
      return state
    },
  )
  const vehicles = useCharacterBuilderStore((state) => state.gear.vehicles)

  const addVehicle = (item: GearData) => {
    itemsSlice.update((draft) => {
      draft.push(item)
    })
  }

  const updateVehicle = (item: GearData) => {
    itemsSlice.update((draft) => {
      const index = draft.findIndex((existing) => existing.id === item.id)
      if (index !== -1) draft[index] = item
    })
  }

  const removeVehicle = (itemId: string) => {
    itemsSlice.update((draft) =>
      draft.filter((existing) => existing.id !== itemId),
    )
  }

  return {
    vehicles,
    addVehicle,
    updateVehicle,
    removeVehicle,
  }
}
