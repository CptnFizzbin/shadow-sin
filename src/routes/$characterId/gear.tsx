import Paper from "@mui/material/Paper"
import { createFileRoute } from "@tanstack/react-router"

import { GearViewPage } from "#/components/Character/GearPage/gear-view-page.tsx"

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
