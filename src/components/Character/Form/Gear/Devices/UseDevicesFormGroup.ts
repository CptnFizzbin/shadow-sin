import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"

export function useDevicesFormGroup() {
  const itemsSlice = useCharacterBuilderStoreSlice(
    (state) => state.gear.devices,
    (state, devices) => {
      state.gear.devices = devices
      return state
    },
  )
  const devices = useCharacterBuilderStore((state) => state.gear.devices)

  const addDeviceItem = (item: GearItemFormState) => {
    itemsSlice.update((draft) => {
      draft.push(item)
    })
  }

  const updateDeviceItem = (item: GearItemFormState) => {
    itemsSlice.update((draft) => {
      const index = draft.findIndex((existing) => existing.id === item.id)
      if (index !== -1) draft[index] = item
    })
  }

  const removeDeviceItem = (itemId: string) => {
    itemsSlice.update((draft) =>
      draft.filter(
        (existing) => existing.id !== itemId && existing.parentId !== itemId,
      ),
    )
  }

  return {
    devices,
    addDeviceItem,
    updateDeviceItem,
    removeDeviceItem,
  }
}
