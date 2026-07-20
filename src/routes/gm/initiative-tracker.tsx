import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { LandingModeSwitch } from "#/components/landing/landingModeSwitch.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"

export const Route = createFileRoute("/gm/initiative-tracker")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack sx={{ gap: 1, padding: 1 }}>
      <LandingModeSwitch />
      <SectionHeader>Initiative Tracker</SectionHeader>

      <UnderConstruction
        title="Initiative Tracker — Under Construction"
        description="Track turn order and initiative scores during combat. Stay tuned!"
      />
    </Stack>
  )
}
