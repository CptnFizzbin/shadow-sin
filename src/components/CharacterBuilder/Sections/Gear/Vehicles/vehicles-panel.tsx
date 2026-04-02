import type { FC } from "react"

import { GearItemsList } from "#/components/CharacterBuilder/Sections/Gear/Generic/gear-items-list.tsx"
import { useGearByType } from "#/components/Gear/use-gear-api.ts"
import type { VehicleData } from "#/lib/system/gear/vehicle-data.ts"
import { GearType } from "#/lib/system/gear-type.ts"

export const VehiclesPanel: FC = () => {
  const vehicles = useGearByType<VehicleData>(GearType.vehicle)

  return (
    <GearItemsList items={vehicles} itemType="Vehicle" />
  )
}
