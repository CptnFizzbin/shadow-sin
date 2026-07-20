import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { LandingModeSwitch } from "#/components/landing/landingModeSwitch.tsx"
import { InitiativeTrackerBoardVariant } from "#/components/system/initiativeTracker/boardVariant.tsx"
import { InitiativeTrackerListVariant } from "#/components/system/initiativeTracker/listVariant.tsx"
import { InitiativeTrackerSpotlightVariant } from "#/components/system/initiativeTracker/spotlightVariant.tsx"
import { Prototype } from "#/components/ui/prototype/prototype.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/gm/initiative-tracker")({
  component: RouteComponent,
})

// PROTOTYPE — three layout options for running combat: "list" (dense,
// manage-everyone-at-once), "board" (at-a-glance card grid for a shared
// screen), "spotlight" (single current-turn focus + on-deck queue for live
// play). Switch between them with the bar fixed to the bottom of the screen.
function RouteComponent() {
  return (
    <Stack sx={{ gap: 1, padding: 1, paddingBottom: 8 }}>
      <LandingModeSwitch />
      <SectionHeader>Initiative Tracker</SectionHeader>

      <Prototype>
        <Prototype.Item name="list">
          <InitiativeTrackerListVariant />
        </Prototype.Item>
        <Prototype.Item name="board">
          <InitiativeTrackerBoardVariant />
        </Prototype.Item>
        <Prototype.Item name="spotlight">
          <InitiativeTrackerSpotlightVariant />
        </Prototype.Item>
      </Prototype>
    </Stack>
  )
}
