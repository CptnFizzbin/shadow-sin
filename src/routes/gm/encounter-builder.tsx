import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { LandingModeSwitch } from "#/components/landing/landingModeSwitch.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"

export const Route = createFileRoute("/gm/encounter-builder")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack sx={{ gap: 1, padding: 1 }}>
      <LandingModeSwitch />
      <SectionHeader>Encounter Builder</SectionHeader>

      <UnderConstruction
        title="Encounter Builder — Under Construction"
        description="Assemble and balance encounters ahead of a run. Stay tuned!"
      />
    </Stack>
  )
}
