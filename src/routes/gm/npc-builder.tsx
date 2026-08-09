import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { LandingModeSwitch } from "#/components/landing/landingModeSwitch.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"

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
