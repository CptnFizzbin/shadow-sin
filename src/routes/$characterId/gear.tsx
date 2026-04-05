import Paper from "@mui/material/Paper"
import { createFileRoute } from "@tanstack/react-router"

import { GearViewPage } from "#/components/character/gearPage/gearViewPage.tsx"

export const Route = createFileRoute("/$characterId/gear")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Paper sx={{ padding: 1 }}>
      <GearViewPage />
    </Paper>
  )
}
