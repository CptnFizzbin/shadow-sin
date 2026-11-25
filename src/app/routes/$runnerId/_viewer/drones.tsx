import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { VehiclesList } from "#/components/entities/items/types/vehicles/vehiclesList.tsx"
import { AvailableGearFilter } from "#/components/entities/items/viewer/availableGearFilter.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { VehicleCategory } from "#/system/model/items/vehicleData.ts"

export const Route = createFileRoute("/$runnerId/_viewer/drones")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack>
      <SectionHeader>Drones</SectionHeader>

      <AvailableGearFilter>
        <VehiclesList vehicleCategory={VehicleCategory.drone} />
      </AvailableGearFilter>
    </Stack>
  )
}
