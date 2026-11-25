import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { AvailableWeaponsSection } from "#/app/components/entities/items/types/weapons/availableWeaponsSection.tsx"
import { AvailableGearFilter } from "#/app/components/entities/items/viewer/availableGearFilter.tsx"
import { SpellsViewerSection } from "#/app/components/runner/awakenings/magician/viewer/spells/spellsViewerSection.tsx"
import { CombatActionsCheatSheetButton } from "#/app/components/system/combat/combatActionsCheatSheetButton.tsx"
import { InitiativeSection } from "#/app/components/system/initiative/initiativeSection.tsx"
import { AwakeningType } from "#/data/magic/awakeningType.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { SectionHeader } from "#/ui/text/sectionHeader.tsx"

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
      <AvailableGearFilter>
        <AvailableWeaponsSection />
      </AvailableGearFilter>

      {canCastSpells && (
        <>
          <Divider />
          <SpellsViewerSection />
        </>
      )}
    </Stack>
  )
}
