import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { VehiclesList } from "#/components/items/types/vehicles/vehiclesList.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { VehicleCategory } from "#/system/gear/vehicleData.ts"

export const Route = createFileRoute("/_viewer/$runnerId/vehicles")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack>
      <SectionHeader>Vehicles</SectionHeader>

      <VehiclesList vehicleCategory={VehicleCategory.vehicle} />
    </Stack>
  )
}
