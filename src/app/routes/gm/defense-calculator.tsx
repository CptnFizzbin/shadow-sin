import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { GmDefenseCalculatorPanel } from "#/components/gmToolbox/combatCalculators/gmDefenseCalculatorPanel.tsx"
import { LandingModeSwitch } from "#/components/gmToolbox/landing/landingModeSwitch.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/gm/defense-calculator")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack sx={{ padding: 1 }}>
      <LandingModeSwitch />
      <SectionHeader>Defense Calculator</SectionHeader>

      <GmDefenseCalculatorPanel />
    </Stack>
  )
}
