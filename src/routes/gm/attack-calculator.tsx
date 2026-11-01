import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { GmAttackCalculatorPanel } from "#/components/gmToolbox/combatCalculators/gmAttackCalculatorPanel.tsx"
import { LandingModeSwitch } from "#/components/gmToolbox/landing/landingModeSwitch.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

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
