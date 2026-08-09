import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { SinsAndLicensesSection } from "#/components/items/types/licenses/sinsAndLicensesSection.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$runnerId/_viewer/licenses")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack>
      <SectionHeader>SINs & Licenses</SectionHeader>
      <SinsAndLicensesSection />
    </Stack>
  )
}
