import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { SinsAndLicensesSection } from "#/components/licenses/sinsAndLicensesSection.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$characterId/licenses")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack sx={{ gap: 1 }}>
      <SectionHeader>SINs & Licenses</SectionHeader>
      <SinsAndLicensesSection />
    </Stack>
  )
}
