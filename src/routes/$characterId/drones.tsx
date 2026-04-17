import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"

import { VehiclesList } from "#/components/vehicles/vehiclesList.tsx"
import { VehicleCategory } from "#/lib/system/gear/vehicleData.ts"

export const Route = createFileRoute("/$characterId/drones")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack gap={1}>
      <Paper sx={{ padding: 1 }}>
        <Typography variant="h2">Drones</Typography>
      </Paper>

      <VehiclesList vehicleCategory={VehicleCategory.drone} />
    </Stack>
  )
}
