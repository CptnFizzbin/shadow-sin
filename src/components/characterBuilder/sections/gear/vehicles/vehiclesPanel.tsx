import type { FC } from "react"

import { GearItemsList } from "#/components/characterBuilder/sections/gear/generic/gearItemsList.tsx"
import { useGearByType } from "#/components/gear/useGearApi.ts"
import type { VehicleData } from "#/lib/system/gear/vehicleData.ts"
import { GearType } from "#/lib/system/gearType.ts"

export const VehiclesPanel: FC = () => {
  const vehicles = useGearByType<VehicleData>(GearType.vehicle)

  return (
    <GearItemsList items={vehicles} itemType="Vehicle" gearType={GearType.vehicle} />
  )
}
