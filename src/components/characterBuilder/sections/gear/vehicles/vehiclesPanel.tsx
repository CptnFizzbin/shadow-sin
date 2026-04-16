import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { VehiclesList } from "#/components/characterBuilder/sections/gear/vehicles/vehiclesList.tsx"
import { VehicleCategory } from "#/lib/system/gear/vehicleData.ts"

export const VehiclesPanel: FC = () => {
  return (
    <Stack gap={1}>
      <VehiclesList vehicleCategory={VehicleCategory.vehicle} />
      <VehiclesList vehicleCategory={VehicleCategory.drone} />
    </Stack>
  )
}
