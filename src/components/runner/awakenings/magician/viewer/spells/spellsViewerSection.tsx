import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { SpellsSelectors } from "#/state/runner/spells/spells.selector.ts"
import { hasSpellEffects } from "#/system/formulas/magic/spellSustaining.ts"
import type { SpellData } from "#/system/model/magic/spellData.ts"

import { useSustainSpellDialog } from "./dialogs/sustainSpellDialog.tsx"
import { SpellCard } from "./spellCard.tsx"
import { useSpellCastDialog } from "./spellCastDialog.tsx"

export const SpellsViewerSection: FC = () => {
  const spells = useRunnerSelector(SpellsSelectors.selectAll)
  const spellCastDialog = useSpellCastDialog()
  const sustainSpellDialog = useSustainSpellDialog()
  const dispatch = useRunnerStoreDispatch()

  const handleOpenSpell = (spell: SpellData) => {
    spellCastDialog.open({ spell })
  }

  const handleToggleSustained = async (spell: SpellData) => {
    if (spell.sustained) {
      dispatch(Actions.spells.stopSustainingSpell(spell.id))
      return
    }

    // Only a Spell with effects needs a target: who it's on decides whether those effects apply to the Runner.
    if (!hasSpellEffects(spell)) {
      dispatch(Actions.spells.startSustainingSpell({ id: spell.id }))
      return
    }

    const target = await sustainSpellDialog.open({ spell })
    if (target) dispatch(Actions.spells.startSustainingSpell({ id: spell.id, target }))
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
    <Stack>
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

      {spellCastDialog.outlet}
      {sustainSpellDialog.outlet}
    </Stack>
  )
}
