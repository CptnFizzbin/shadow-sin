import type { FC } from "react"

import { GearItemsList } from "#/components/characterBuilder/sections/gear/generic/gearItemsList.tsx"
import { useGearByType } from "#/components/gear/useGearApi.ts"
import type { VehicleData } from "#/lib/system/gear/vehicleData.ts"
import { ItemType } from "#/lib/system/itemType.ts"

export const VehiclesPanel: FC = () => {
  const vehicles = useGearByType<VehicleData>(ItemType.vehicle)

  return (
    <GearItemsList items={vehicles} itemLabel="Vehicle" itemType={ItemType.vehicle} />
  )
}
