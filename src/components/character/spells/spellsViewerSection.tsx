import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { SpellCastDialog } from "#/components/character/spells/spellCastDialog.tsx"
import { SpellViewerListItem } from "#/components/character/spells/spellViewerListItem.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import type { SpellData } from "#/lib/system/magic/spellData.ts"

type DialogState = { spell: SpellData, open: boolean } | null

export const SpellsViewerSection: FC = () => {
  const spells = useCharacterSheet((sheet) => sheet.spells)
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const handleOpenSpell = (spell: SpellData) => {
    setDialogState({ spell, open: true })
  }

  const handleCloseDialog = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const handleDialogClosed = () => {
    setDialogState(null)
  }

  const spellsByCategory = Object.groupBy(spells, (spell) => spell.category)

  if (spells.length === 0) {
    return (
      <Paper sx={{ padding: 1 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No spells learned
        </Typography>
      </Paper>
    )
  }

  return (
    <>
      <Stack gap={1}>
        {Object.entries(spellsByCategory).map(([category, categorySpells]) => (
          <Stack key={category} gap={0.5}>
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

      {dialogState && (
        <SpellCastDialog
          spell={dialogState.spell}
          open={dialogState.open}
          onClose={handleCloseDialog}
          onClosed={handleDialogClosed}
        />
      )}
    </>
  )
}
