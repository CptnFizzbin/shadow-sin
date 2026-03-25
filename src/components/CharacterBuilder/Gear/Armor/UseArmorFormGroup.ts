import {
  useBuilderStoreSlice,
  useBuildStateStore,
} from "#/components/CharacterBuilder/BuilderState/BuilderStateProvider.tsx"
import type { GearData } from "#/lib/system/types/gear/gearData.ts"

export function useArmorFormGroup() {
  const itemsSlice = useBuilderStoreSlice(
    (state) => state.gear.armor,
    (state, armor) => {
      state.gear.armor = armor
      return state
    },
  )
  const armor = useBuildStateStore((state) => state.gear.armor)

  const addArmor = (item: GearData) => {
    itemsSlice.update((draft) => {
      draft.push(item)
    })
  }

  const updateArmor = (item: GearData) => {
    itemsSlice.update((draft) => {
      const index = draft.findIndex((existing) => existing.id === item.id)
      if (index !== -1) draft[index] = item
    })
  }

  const removeArmor = (itemId: string) => {
    itemsSlice.update((draft) =>
      draft.filter(
        (existing) => existing.id !== itemId && existing.parentId !== itemId,
      ),
    )
  }

  return {
    armor,
    addArmor,
    updateArmor,
    removeArmor,
  }
}
