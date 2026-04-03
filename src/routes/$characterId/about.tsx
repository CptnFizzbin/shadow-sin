import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { AttributesSection } from "#/components/Attributes/attributes-section.tsx"
import { FinancesSection } from "#/components/Character/finances-section.tsx"
import { ProfileSection } from "#/components/Character/profile-section.tsx"

export const Route = createFileRoute("/$characterId/about")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack gap={1}>
      <Paper sx={{ padding: 1 }}>
        <ProfileSection />
      </Paper>

      <Paper sx={{ padding: 1 }}>
        <FinancesSection />
      </Paper>

      <AttributesSection />
    </Stack>
  )
}
