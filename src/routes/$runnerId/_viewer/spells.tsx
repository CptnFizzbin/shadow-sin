import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"

import { SpellsViewerSection } from "#/components/magician/viewer/spells/spellsViewerSection.tsx"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { AwakeningType } from "#/system/model/magic/awakeningType.ts"

export const Route = createFileRoute("/$runnerId/_viewer/spells")({
  component: RouteComponent,
})

function RouteComponent() {
  const awakening = useRunnerSelector(BiologySelectors.selectAwakening)
  const canCastSpells =
    awakening === AwakeningType.Magician || awakening === AwakeningType.MysticAdept

  if (!canCastSpells) {
    return (
      <Paper sx={{ padding: 2 }}>
        <Typography color="text.secondary" sx={{ textAlign: "center" }}>
          This runner is not awakened as a spellcaster.
        </Typography>
      </Paper>
    )
  }

  return (
    <Stack>
      <SpellsViewerSection />
    </Stack>
  )
}
