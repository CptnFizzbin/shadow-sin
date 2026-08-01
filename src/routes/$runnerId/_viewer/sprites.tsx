import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"

export const Route = createFileRoute("/$runnerId/_viewer/sprites")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack sx={{ gap: 1 }}>
      <SectionHeader>Sprites</SectionHeader>

      <UnderConstruction />
    </Stack>
  )
}
