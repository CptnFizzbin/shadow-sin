import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"

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
    itemsSlice.update((prev: GearItemFormState[]) => {
      return [...prev, { ...item, id: crypto.randomUUID() }]
    })
  }

  const updateMiscItem = (item: GearItemFormState) => {
    itemsSlice.update((draft) => {
      return draft.map((existing) =>
        existing.id === item.id ? item : existing,
      )
    })
  }

  const removeMiscItem = (itemId: string) => {
    itemsSlice.update((draft) => {
      return draft.filter(
        (existing) => existing.id !== itemId && existing.parentId !== itemId,
      )
    })
  }

  return {
    misc,
    addMiscItem,
    updateMiscItem,
    removeMiscItem,
  }
}
