import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"

export function useArmorFormGroup() {
  const itemsSlice = useCharacterBuilderStoreSlice(
    (state) => state.gear.armor,
    (state, armor) => {
      state.gear.armor = armor
      return state
    },
  )
  const armor = useCharacterBuilderStore((state) => state.gear.armor)

  const addArmor = (item: GearItemFormState) => {
    itemsSlice.update((draft) => {
      draft.push(item)
    })
  }

  const updateArmor = (item: GearItemFormState) => {
    itemsSlice.update((draft) => {
      const index = draft.findIndex((existing) => existing.id === item.id)
      if (index !== -1) draft[index] = item
    })
  }

  const removeArmor = (itemId: string) => {
    itemsSlice.update((draft) => draft.filter((existing) => existing.id !== itemId))
  }

  return {
    armor,
    addArmor,
    updateArmor,
    removeArmor,
  }
}
