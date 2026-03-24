import {
  useBuilderStore,
  useBuilderStoreSlice,
} from "#/components/CharacterBuilder/BuilderStoreProvider.tsx"
import type { GearData } from "#/lib/system/types/gear/gearData.ts"

export function useMiscFormGroup() {
  const itemsSlice = useBuilderStoreSlice(
    (state) => state.gear.misc,
    (state, misc) => {
      state.gear.misc = misc
      return state
    },
  )
  const misc = useBuilderStore((state) => state.gear.misc)

  const addMiscItem = (item: GearData) => {
    itemsSlice.update((draft) => {
      draft.push(item)
    })
  }

  const updateMiscItem = (item: GearData) => {
    itemsSlice.update((draft) => {
      const index = draft.findIndex((existing) => existing.id === item.id)
      if (index !== -1) draft[index] = item
    })
  }

  const removeMiscItem = (itemId: string) => {
    itemsSlice.update((draft) =>
      draft.filter(
        (existing) => existing.id !== itemId && existing.parentId !== itemId,
      ),
    )
  }

  return {
    misc,
    addMiscItem,
    updateMiscItem,
    removeMiscItem,
  }
}
