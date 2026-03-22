import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"

export function useMiscFormGroup() {
  const itemsSlice = useCharacterBuilderStoreSlice(
    (state) => state.gear.misc,
    (state, misc) => {
      state.gear.misc = misc
      return state
    },
  )
  const misc = useCharacterBuilderStore((state) => state.gear.misc)

  const addMiscItem = (item: GearItemFormState) => {
    itemsSlice.update((draft) => {
      draft.push(item)
    })
  }

  const updateMiscItem = (item: GearItemFormState) => {
    itemsSlice.update((draft) => {
      const index = draft.findIndex((existing) => existing.id === item.id)
      if (index !== -1) draft[index] = item
    })
  }

  const removeMiscItem = (itemId: string) => {
    itemsSlice.update((draft) =>
      draft.filter((existing) => existing.id !== itemId),
    )
  }

  return {
    misc,
    addMiscItem,
    updateMiscItem,
    removeMiscItem,
  }
}
