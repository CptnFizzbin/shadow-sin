import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { EquippedWeaponsSection } from "#/components/entities/items/types/weapons/equippedWeaponsSection.tsx"
import { SpellsViewerSection } from "#/components/runner/awakenings/magician/viewer/spells/spellsViewerSection.tsx"
import { CombatActionsCheatSheetButton } from "#/components/system/combat/combatActionsCheatSheetButton.tsx"
import { InitiativeSection } from "#/components/system/initiative/initiativeSection.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { AwakeningType } from "#/system/model/magic/awakeningType.ts"

export const Route = createFileRoute("/$runnerId/_viewer/offense")({
  component: RouteComponent,
})

function RouteComponent() {
  const awakening = useRunnerSelector(BiologySelectors.selectAwakening)
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
