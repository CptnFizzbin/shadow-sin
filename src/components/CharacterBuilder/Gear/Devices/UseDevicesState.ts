import { useCallback } from "react"

import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useGearApi } from "#/lib/gear/UseGearApi.ts"

export function useDeviceSet() {
  const gear = useGearApi()

  return {
    devices: gear.getByType<GearItemFormState>("devices"),
    addDevice: useCallback((item: Omit<GearItemFormState, "id">) => {
      gear.create({ ...item, itemType: "devices" })
    }, [gear]),
    updateDevice: useCallback((item: GearItemFormState) => {
      gear.set({ ...item, itemType: "devices" })
    }, [gear]),
    removeDevice: useCallback((item: GearItemFormState) => {
      gear.remove(item.id, { removeChildren: true })
    }, [gear]),
  }
}

export function useDevicesState() {
  const { devices, addDevice, updateDevice, removeDevice } = useDeviceSet()
  return {
    devices,
    addDeviceItem: addDevice,
    updateDeviceItem: updateDevice,
    removeDeviceItem: removeDevice,
  }
}
