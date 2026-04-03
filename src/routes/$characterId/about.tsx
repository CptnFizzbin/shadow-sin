import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { AttributesSection } from "#/components/Character/attributes-section.tsx"
import { BiologySection } from "#/components/Character/biology-section.tsx"
import { FinancesSection } from "#/components/Character/finances-section.tsx"
import { ProfileSection } from "#/components/Character/profile-section.tsx"
import { SinsAndLicensesSection } from "#/components/Character/sins-and-licenses-section.tsx"

export const Route = createFileRoute("/$characterId/about")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack gap={1}>
      <Paper sx={{ padding: 1 }}>
        <Stack gap={1.5}>
          <ProfileSection />
          <Divider />
          <BiologySection />
          <Divider />
          <SinsAndLicensesSection />
        </Stack>
      </Paper>

      <Paper sx={{ padding: 1 }}>
        <FinancesSection />
      </Paper>

      <AttributesSection />
    </Stack>
  )
}
