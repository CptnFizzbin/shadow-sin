import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { LandingModeSwitch } from "#/components/landing/landingModeSwitch.tsx"
import { InitiativeTrackerPanel } from "#/components/system/initiativeTracker/initiativeTrackerPanel.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

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
