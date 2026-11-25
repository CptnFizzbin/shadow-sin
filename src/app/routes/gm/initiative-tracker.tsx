import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { InitiativeTrackerPanel } from "#app/components/gmToolbox/initiativeTracker/initiativeTrackerPanel.tsx"
import { LandingModeSwitch } from "#app/components/gmToolbox/landing/landingModeSwitch.tsx"
import { SectionHeader } from "#ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/gm/initiative-tracker")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack sx={{ padding: 1 }}>
      <LandingModeSwitch />
      <SectionHeader>Initiative Tracker</SectionHeader>

      <InitiativeTrackerPanel />
    </Stack>
  )
}
