import type { FC } from "react"

import { useDevicesFormGroup } from "#/components/Character/Form/Gear/Devices/UseDevicesFormGroup.ts"
import { GearItemsList } from "#/components/Character/Form/Gear/Generic/GearItemsList.tsx"

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
