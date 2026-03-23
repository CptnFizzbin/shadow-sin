import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"

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
    itemsSlice.update((prev: GearItemFormState[]) => [
      ...prev,
      { ...item, id: crypto.randomUUID() },
    ])
  }

  const updateArmor = (item: GearItemFormState) => {
    itemsSlice.update((draft) => {
      return draft.map((existing) =>
        existing.id === item.id ? item : existing,
      )
    })
  }

  const removeArmor = (itemId: string) => {
    itemsSlice.update((draft) => {
      return draft.filter(
        (existing) => existing.id !== itemId && existing.parentId !== itemId,
      )
    })
  }

  return {
    armor,
    addArmor,
    updateArmor,
    removeArmor,
  }
}
