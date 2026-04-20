import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { VehiclesList } from "#/components/vehicles/vehiclesList.tsx"
import { VehicleCategory } from "#/system/gear/vehicleData.ts"

export const VehiclesPanel: FC = () => {
  return (
    <Stack sx={{ gap: 1 }}>
      <VehiclesList vehicleCategory={VehicleCategory.vehicle} />
      <VehiclesList vehicleCategory={VehicleCategory.drone} />
    </Stack>
  )
}
