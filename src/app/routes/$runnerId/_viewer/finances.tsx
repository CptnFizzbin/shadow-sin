import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { CredstickSection } from "#/components/entities/items/types/credsticks/credstickSection.tsx"
import { FinancesSection } from "#/components/runner/sections/finances/viewer/financesSection.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$runnerId/_viewer/finances")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack>
      <SectionHeader>Finances</SectionHeader>

      <FinancesSection />

      <CredstickSection />
    </Stack>
  )
}
