import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { LandingModeSwitch } from "#app/components/gmToolbox/landing/landingModeSwitch.tsx"
import { UnderConstruction } from "#ui/alerts/underConstruction.tsx"
import { SectionHeader } from "#ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/gm/encounter-builder")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack sx={{ padding: 1 }}>
      <LandingModeSwitch />
      <SectionHeader>Encounter Builder</SectionHeader>

      <UnderConstruction
        title="Encounter Builder — Under Construction"
        description="Assemble and balance encounters ahead of a run. Stay tuned!"
      />
    </Stack>
  )
}
