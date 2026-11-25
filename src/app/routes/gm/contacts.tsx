import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { GmContactsPanel } from "#/app/components/gmToolbox/contacts/gmContactsPanel.tsx"
import { LandingModeSwitch } from "#/app/components/gmToolbox/landing/landingModeSwitch.tsx"
import { SectionHeader } from "#/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/gm/contacts")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack sx={{ padding: 1 }}>
      <LandingModeSwitch />
      <SectionHeader>Contacts</SectionHeader>

      <GmContactsPanel />
    </Stack>
  )
}
