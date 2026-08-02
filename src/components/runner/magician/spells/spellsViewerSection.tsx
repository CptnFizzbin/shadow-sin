import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { SpellData } from "#/system/magic/spellData.ts"

import { SpellCard } from "./spellCard.tsx"
import { useSpellCastDialog } from "./spellCastDialog.tsx"

export const SpellsViewerSection: FC = () => {
  const spells = useRunnerStoreSelector(Selectors.spells.selectSpells)
  const spellCastDialog = useSpellCastDialog()
  const dispatch = useRunnerStoreDispatch()

  const handleOpenSpell = (spell: SpellData) => {
    spellCastDialog.open({ spell })
  }

  const handleToggleSustained = (spell: SpellData) => {
    dispatch(Actions.spells.toggleSpellSustained(spell.id))
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
            <SpellCard
              key={spell.id}
              spell={spell}
              onOpen={() => handleOpenSpell(spell)}
              onToggleSustained={() => handleToggleSustained(spell)}
            />
          ))}
        </Stack>
      ))}

      {spellCastDialog.dialog}
    </Stack>
  )
}
