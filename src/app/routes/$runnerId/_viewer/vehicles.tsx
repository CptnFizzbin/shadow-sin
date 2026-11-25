import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { VehiclesList } from "#/app/components/entities/items/types/vehicles/vehiclesList.tsx"
import { AvailableGearFilter } from "#/app/components/entities/items/viewer/availableGearFilter.tsx"
import { VehicleCategory } from "#/data/items/vehicleData.ts"
import { SectionHeader } from "#/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$runnerId/_viewer/vehicles")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack>
      <SectionHeader>Vehicles</SectionHeader>

      <AvailableGearFilter>
        <VehiclesList vehicleCategory={VehicleCategory.vehicle} />
      </AvailableGearFilter>
    </Stack>
  )
}
