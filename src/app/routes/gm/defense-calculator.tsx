import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { GmDefenseCalculatorPanel } from "#app/components/gmToolbox/combatCalculators/gmDefenseCalculatorPanel.tsx"
import { LandingModeSwitch } from "#app/components/gmToolbox/landing/landingModeSwitch.tsx"
import { SectionHeader } from "#ui/text/sectionHeader.tsx"

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
