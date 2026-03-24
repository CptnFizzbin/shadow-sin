import {
  useCharacterSheet,
  useCharacterSheetSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { GearData } from "#/lib/system/types/gear/gearData.ts"

export function useDevicesFormGroup() {
  const itemsSlice = useCharacterSheetSlice(
    (state) => state.gear.devices,
    (state, devices) => {
      state.gear.devices = devices
      return state
    },
  )
  const devices = useCharacterSheet((state) => state.gear.devices)

  const addDeviceItem = (item: GearData) => {
    itemsSlice.update((draft) => {
      draft.push(item)
    })
  }

  const updateDeviceItem = (item: GearData) => {
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
