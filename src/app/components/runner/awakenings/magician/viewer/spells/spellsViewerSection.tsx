import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { SpellData } from "#/data/magic/spellData.ts"
import { getAvailableSustainingFoci } from "#/rules/magic/focusRules.ts"
import { getSustainingFocus, hasSpellEffects } from "#/rules/magic/spellSustaining.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { SpellsSelectors } from "#/state/runner/spells/spells.selector.ts"
import { Label } from "#/ui/text/label.tsx"

import { useSustainSpellDialog } from "./dialogs/sustainSpellDialog.tsx"
import { SpellCard } from "./spellCard.tsx"
import { useSpellCastDialog } from "./spellCastDialog.tsx"

export const SpellsViewerSection: FC = () => {
  const spells = useRunnerSelector(SpellsSelectors.selectAll)
  const foci = useRunnerSelector(ItemSelectors.Foci.selectAll)
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

    // Only ask when there's a choice: a target for a Spell with effects (who it's on decides whether those effects
    // apply to the Runner), or a free Sustaining Focus to hold it.
    const sustainingFoci = getAvailableSustainingFoci(foci, spells, spell)
    if (!hasSpellEffects(spell) && sustainingFoci.length === 0) {
      dispatch(Actions.spells.startSustainingSpell({ id: spell.id }))
      return
    }

    const choice = await sustainSpellDialog.open({ spell, sustainingFoci })
    if (choice) dispatch(Actions.spells.startSustainingSpell({ id: spell.id, ...choice }))
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
              sustainingFocusName={spell.sustained ? getSustainingFocus(spell, foci)?.name : undefined}
            />
          ))}
        </Stack>
      ))}

      {spellCastDialog.outlet}
      {sustainSpellDialog.outlet}
    </Stack>
  )
}
