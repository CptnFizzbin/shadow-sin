import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"

export function useVehiclesFormGroup() {
  const itemsSlice = useCharacterBuilderStoreSlice(
    (state) => state.gear.vehicles,
    (state, vehicles) => {
      state.gear.vehicles = vehicles
      return state
    },
  )
  const vehicles = useCharacterBuilderStore((state) => state.gear.vehicles)

  const addVehicle = (item: GearItemFormState) => {
    itemsSlice.update((draft) => {
      draft.push(item)
    })
  }

  const updateVehicle = (item: GearItemFormState) => {
    itemsSlice.update((draft) => {
      const index = draft.findIndex((existing) => existing.id === item.id)
      if (index !== -1) draft[index] = item
    })
  }

  const removeVehicle = (itemId: string) => {
    itemsSlice.update((draft) =>
      draft.filter(
        (existing) => existing.id !== itemId && existing.parentId !== itemId,
      ),
    )
  }

  return {
    vehicles,
    addVehicle,
    updateVehicle,
    removeVehicle,
  }
}
