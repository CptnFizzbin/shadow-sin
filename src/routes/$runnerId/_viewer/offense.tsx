import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { EquippedWeaponsSection } from "#/components/items/types/weapons/equippedWeaponsSection.tsx"
import { SpellsViewerSection } from "#/components/runner/magician/spells/spellsViewerSection.tsx"
import { CombatActionsCheatSheetButton } from "#/components/system/combat/combatActionsCheatSheetButton.tsx"
import { InitiativeSection } from "#/components/system/initiative/initiativeSection.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { selectAwakening } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { AwakeningType } from "#/system/awakeningType.ts"

export const Route = createFileRoute("/$runnerId/_viewer/offense")({
  component: RouteComponent,
})

function RouteComponent() {
  const awakening = useRunnerStoreSelector(selectAwakening)
  const canCastSpells =
    awakening === AwakeningType.Magician || awakening === AwakeningType.MysticAdept

  return (
    <Stack>
      <SectionHeader>Offense</SectionHeader>

      <CombatActionsCheatSheetButton />
      <Divider />

      <InitiativeSection />
      <Divider />
      <EquippedWeaponsSection />

      {canCastSpells && (
        <>
          <Divider />
          <SpellsViewerSection />
        </>
      )}
    </Stack>
  )
}
