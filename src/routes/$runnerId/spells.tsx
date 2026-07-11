import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"

import { useRunnerData } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { SpellsViewerSection } from "#/components/runner/spells/spellsViewerSection.tsx"
import { AwakeningType } from "#/system/awakeningType.ts"

export const Route = createFileRoute("/$runnerId/spells")({
  component: RouteComponent,
})

function RouteComponent() {
  const awakening = useRunnerData((sheet) => sheet.biology.awakening)
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
    <Stack sx={{ gap: 1 }}>
      <SpellsViewerSection />
    </Stack>
  )
}
