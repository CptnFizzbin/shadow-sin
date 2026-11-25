import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { LandingModeSwitch } from "#/app/components/gmToolbox/landing/landingModeSwitch.tsx"
import { UnderConstruction } from "#/ui/alerts/underConstruction.tsx"
import { SectionHeader } from "#/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/gm/npc-builder")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack sx={{ padding: 1 }}>
      <LandingModeSwitch />
      <SectionHeader>NPC Builder</SectionHeader>

      <UnderConstruction
        title="NPC Builder — Under Construction"
        description="Quickly stat out NPCs with a simplified character creator. Stay tuned!"
      />
    </Stack>
  )
}
