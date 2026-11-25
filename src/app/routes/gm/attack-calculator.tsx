import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { GmAttackCalculatorPanel } from "#app/components/gmToolbox/combatCalculators/gmAttackCalculatorPanel.tsx"
import { LandingModeSwitch } from "#app/components/gmToolbox/landing/landingModeSwitch.tsx"
import { SectionHeader } from "#ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/gm/attack-calculator")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack sx={{ padding: 1 }}>
      <LandingModeSwitch />
      <SectionHeader>Attack Calculator</SectionHeader>

      <GmAttackCalculatorPanel />
    </Stack>
  )
}
