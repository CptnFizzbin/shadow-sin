import type { FC } from "react"

import { useDevicesState } from "#/components/CharacterBuilder/Sections/Gear/Devices/UseDevicesState.ts"
import { GearItemsList } from "#/components/CharacterBuilder/Sections/Gear/Generic/GearItemsList.tsx"

export const DevicesPanel: FC = () => {
  const { devices, addDeviceItem, updateDeviceItem, removeDeviceItem } =
    useDevicesState()

  return (
    <GearItemsList
      items={devices}
      onAdd={addDeviceItem}
      onUpdate={updateDeviceItem}
      onRemove={removeDeviceItem}
      label="Device"
    />
  )
}
