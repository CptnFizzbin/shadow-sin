import { useCallback } from "react"

import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useBuilderGearApi } from "#/components/CharacterBuilder/Gear/UseBuilderGearApi.ts"

export function useDeviceSet() {
  const gear = useBuilderGearApi()

  return {
    devices: gear.getItemsByType<GearItemFormState>("devices"),
    addDevice: useCallback((item: Omit<GearItemFormState, "id">) => {
      gear.createItem({ ...item, type: "devices" })
    }, [gear]),
    updateDevice: useCallback((item: GearItemFormState) => {
      gear.saveItem({ ...item, type: "devices" })
    }, [gear]),
    removeDevice: useCallback((item: GearItemFormState) => {
      gear.deleteItem({ id: item.id }, { removeChildren: true })
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
