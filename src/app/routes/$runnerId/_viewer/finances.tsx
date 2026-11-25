import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { CredstickSection } from "#/app/components/entities/items/types/credsticks/credstickSection.tsx"
import { FinancesSection } from "#/app/components/runner/sections/finances/viewer/financesSection.tsx"
import { SectionHeader } from "#/ui/text/sectionHeader.tsx"

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
