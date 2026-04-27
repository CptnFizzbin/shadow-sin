import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { CombatHud } from "#/components/character/combat/combatHud.tsx"
import { EquippedWeaponsSection } from "#/components/items/types/weapons/equippedWeaponsSection.tsx"
import { ManualStatusPanel } from "#/components/system/manualStatus/manualStatusPanel.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$characterId/offense")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack>
      <SectionHeader>Offense</SectionHeader>

      <CombatHud />
      <Divider />
      <ManualStatusPanel />
      <Divider />
      <EquippedWeaponsSection />
    </Stack>
  )
}
