import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import type { SpellData } from "#/system/magic/spellData.ts"

import { useSpellCastDialog } from "./spellCastDialog.tsx"
import { SpellViewerListItem } from "./spellViewerListItem.tsx"

export const SpellsViewerSection: FC = () => {
  const spells = useCharacterSheet((sheet) => sheet.spells)
  const spellCastDialog = useSpellCastDialog()

  const handleOpenSpell = (spell: SpellData) => {
    spellCastDialog.open({ spell })
  }

  const spellsByCategory = Object.groupBy(spells, (spell) => spell.category)

  if (spells.length === 0) {
    return (
      <Paper sx={{ padding: 1 }}>
        <Typography color="text.secondary" sx={{ textAlign: "center" }}>
          No spells learned
        </Typography>
      </Paper>
    )
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {Object.entries(spellsByCategory).map(([category, categorySpells]) => (
        <Stack key={category} sx={{ gap: 0.5 }}>
          <Label label={category} variant="outlined" />
          {categorySpells.map((spell) => (
            <SpellViewerListItem
              key={spell.id}
              spell={spell}
              onClick={() => handleOpenSpell(spell)}
            />
          ))}
        </Stack>
      ))}
    </Stack>
  )
}
