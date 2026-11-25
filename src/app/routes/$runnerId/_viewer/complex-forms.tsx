import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"

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
