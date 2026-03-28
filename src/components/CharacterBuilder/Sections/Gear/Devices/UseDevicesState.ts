import type { GearItemFormState } from "#/components/CharacterBuilder/Sections/Gear/Generic/Forms/GearItemFormState.ts"
import { useGearApi, useGearByType } from "#/components/Gear/UseGearApi.ts"

export function useDeviceSet() {
  const gear = useGearApi()
  const devices = useGearByType<GearItemFormState>("devices")

  return {
    devices,
    addDevice(item: Omit<GearItemFormState, "id">) {
      gear.add({ ...item, itemType: "devices" })
    },
    updateDevice(item: GearItemFormState) {
      gear.set({ ...item, itemType: "devices" })
    },
    removeDevice(item: GearItemFormState) {
      gear.remove(item.id, { removeChildren: true })
    },
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
