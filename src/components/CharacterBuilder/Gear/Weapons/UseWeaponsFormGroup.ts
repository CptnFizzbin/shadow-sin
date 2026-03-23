import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"

export function useWeaponsFormGroup() {
  const itemsSlice = useCharacterBuilderStoreSlice(
    (state) => state.gear.weapons,
    (state, weapons) => {
      state.gear.weapons = weapons
      return state
    },
  )
  const weapons = useCharacterBuilderStore((state) => state.gear.weapons)

  const addWeapon = (item: GearItemFormState) => {
    itemsSlice.update((prev: GearItemFormState[]) => [
      ...prev,
      { ...item, id: crypto.randomUUID() },
    ])
  }

  const updateWeapon = (item: GearItemFormState) => {
    itemsSlice.update((draft) => {
      return draft.map((existing) =>
        existing.id === item.id ? item : existing,
      )
    })
  }

  const removeWeapon = (itemId: string) => {
    itemsSlice.update((draft) => {
      return draft.filter(
        (existing) => existing.id !== itemId && existing.parentId !== itemId,
      )
    })
  }

  return {
    weapons,
    addWeapon,
    updateWeapon,
    removeWeapon,
  }
}
