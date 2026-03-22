import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"

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
    itemsSlice.update((draft) => {
      draft.push(item)
    })
  }

  const updateWeapon = (item: GearItemFormState) => {
    itemsSlice.update((draft) => {
      const index = draft.findIndex((existing) => existing.id === item.id)
      if (index !== -1) draft[index] = item
    })
  }

  const removeWeapon = (itemId: string) => {
    itemsSlice.update((draft) => draft.filter((existing) => existing.id !== itemId))
  }

  return {
    weapons,
    addWeapon,
    updateWeapon,
    removeWeapon,
  }
}
