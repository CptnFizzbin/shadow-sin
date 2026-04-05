import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { SpellsViewerSection } from "#/components/character/spells/spellsViewerSection.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { AwakeningType } from "#/lib/system/awakeningType.ts"

export const Route = createFileRoute("/$characterId/spells")({
  component: RouteComponent,
})

function RouteComponent() {
  const awakening = useCharacterSheet((sheet) => sheet.biology.awakening)
  const canCastSpells =
    awakening === AwakeningType.Magician || awakening === AwakeningType.MysticAdept

  if (!canCastSpells) {
    return (
      <Paper sx={{ padding: 2 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          This character is not awakened as a spellcaster.
        </Typography>
      </Paper>
    )
  }

  return (
    <Stack gap={1}>
      <Paper>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Spells
        </Typography>
      </Paper>

      <Label label="Spell List" variant="outlined" />
      <SpellsViewerSection />
    </Stack>
  )
}
