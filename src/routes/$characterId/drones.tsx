import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { VehiclesList } from "#/components/vehicles/vehiclesList.tsx"
import { VehicleCategory } from "#/lib/system/gear/vehicleData.ts"

export const Route = createFileRoute("/$characterId/drones")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack>
      <SectionHeader>Drones</SectionHeader>

      <VehiclesList vehicleCategory={VehicleCategory.drone} />
    </Stack>
  )
}
