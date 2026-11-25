import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { UnderConstruction } from "#ui/alerts/underConstruction.tsx"
import { SectionHeader } from "#ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$runnerId/_viewer/complex-forms")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack>
      <SectionHeader>Complex Forms</SectionHeader>

      <UnderConstruction />
    </Stack>
  )
}
