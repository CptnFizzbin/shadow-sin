import {
  useBuilderStoreSlice,
  useBuildStateStore,
} from "#/components/CharacterBuilder/BuilderState/BuilderStateProvider.tsx"
import type { GearData } from "#/lib/system/types/gear/gearData.ts"

export function useWeaponsFormGroup() {
  const itemsSlice = useBuilderStoreSlice(
    (state) => state.gear.weapons,
    (state, weapons) => {
      state.gear.weapons = weapons
      return state
    },
  )
  const weapons = useBuildStateStore((state) => state.gear.weapons)

  const addWeapon = (item: GearData) => {
    itemsSlice.update((draft) => {
      draft.push(item)
    })
  }

  const updateWeapon = (item: GearData) => {
    itemsSlice.update((draft) => {
      const index = draft.findIndex((existing) => existing.id === item.id)
      if (index !== -1) draft[index] = item
    })
  }

  const removeWeapon = (itemId: string) => {
    itemsSlice.update((draft) =>
      draft.filter(
        (existing) => existing.id !== itemId && existing.parentId !== itemId,
      ),
    )
  }

  return {
    weapons,
    addWeapon,
    updateWeapon,
    removeWeapon,
  }
}
