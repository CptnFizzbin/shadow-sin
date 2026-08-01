import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { EquippedWeaponsSection } from "#/components/items/types/weapons/equippedWeaponsSection.tsx"
import { CombatActionsCheatSheetButton } from "#/components/system/combat/combatActionsCheatSheetButton.tsx"
import { InitiativeSection } from "#/components/system/initiative/initiativeSection.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/_viewer/$runnerId/offense")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack>
      <SectionHeader>Offense</SectionHeader>

      <CombatActionsCheatSheetButton />
      <Divider />

      <InitiativeSection />
      <Divider />
      <EquippedWeaponsSection />
    </Stack>
  )
}
