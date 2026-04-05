import type { FC } from "react"

import { GearItemsList } from "#/components/characterBuilder/sections/gear/generic/gearItemsList.tsx"
import { useGearByType } from "#/components/gear/useGearApi.ts"
import type { DeviceData } from "#/lib/system/gear/deviceData.ts"
import { GearType } from "#/lib/system/gearType.ts"

export const DevicesPanel: FC = () => {
  const devices = useGearByType<DeviceData>(GearType.device)

  return (
    <GearItemsList items={devices} itemType="Device" />
  )
}
