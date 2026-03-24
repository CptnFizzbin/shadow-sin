import type { FC } from "react"

import { useDevicesFormGroup } from "#/components/CharacterBuilder/Gear/Devices/UseDevicesFormGroup.ts"
import { GearItemsList } from "#/components/CharacterBuilder/Gear/Generic/GearItemsList.tsx"

export const DevicesPanel: FC = () => {
  const { devices, addDeviceItem, updateDeviceItem, removeDeviceItem } =
    useDevicesFormGroup()

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
