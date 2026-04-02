import type { FC } from "react"

import { GearItemsList } from "#/components/CharacterBuilder/Sections/Gear/Generic/gear-items-list.tsx"
import { useGearByType } from "#/components/Gear/use-gear-api.ts"
import type { DeviceData } from "#/lib/system/gear/device-data.ts"
import { GearType } from "#/lib/system/gear-type.ts"

export const DevicesPanel: FC = () => {
  const devices = useGearByType<DeviceData>(GearType.device)

  return (
    <GearItemsList items={devices} itemType="Device" />
  )
}
