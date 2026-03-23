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
    itemsSlice.update((prev: GearItemFormState[]) => [
      ...prev,
      { ...item, id: crypto.randomUUID() },
    ])
  }

  const updateVehicle = (item: GearItemFormState) => {
    itemsSlice.update((draft) => {
      return draft.map((existing) =>
        existing.id === item.id ? item : existing,
      )
    })
  }

  const removeVehicle = (itemId: string) => {
    itemsSlice.update((draft) => {
      return draft.filter(
        (existing) => existing.id !== itemId && existing.parentId !== itemId,
      )
    })
  }

  return {
    vehicles,
    addVehicle,
    updateVehicle,
    removeVehicle,
  }
}
