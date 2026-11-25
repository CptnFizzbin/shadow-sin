import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { SpellSustainTarget } from "#/data/magic/spellData.ts"
import { hasSpellEffects } from "#/rules/magic/spellSustaining.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { SpellsSelectors } from "#/state/runner/spells/spells.selector.ts"
import { Icons } from "#/ui/icons/icons.ts"
import { Label } from "#/ui/text/label.tsx"

import { SpellSustainTargetToggle } from "./spellSustainTargetToggle.tsx"

interface SpellSustainSectionProps {
  spellId: string
  /** The Sustaining Focus to hold the Spell when sustaining starts, or `null` for the caster to sustain it. */
  sustainingFocusId?: string | null
}

/**
 * Starts or stops sustaining a sustainable Spell from its cast dialog. For a Spell with effects it
 * also picks who the Spell is sustained on, which takes effect immediately while it is sustained.
 * Sustaining starts with `sustainingFocusId` holding the Spell, when given.
 */
export const SpellSustainSection: FC<SpellSustainSectionProps> = ({ spellId, sustainingFocusId = null }) => {
  // The cast dialog only holds the Spell as it was when opened, so read it live to reflect the toggles below.
  const spell = useRunnerSelector(SpellsSelectors.selectById, { spellId })
  const heldByFocus = useRunnerSelector(SpellsSelectors.selectSustainingFocus, { spellId })
  const dispatch = useRunnerStoreDispatch()

  if (!spell) return null

  const target = spell.sustainedOn ?? SpellSustainTarget.Self

  const handleToggleSustained = () => {
    if (spell.sustained) dispatch(Actions.spells.stopSustainingSpell(spell.id))
    else dispatch(Actions.spells.startSustainingSpell({ id: spell.id, target, sustainedBy: sustainingFocusId }))
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <Label label={spell.sustained ? "Sustaining" : "Sustain"} variant="text" />

      {heldByFocus && (
        <Typography variant="body2" color="text.secondary">
          Held by {heldByFocus.name} — no sustaining penalty
        </Typography>
      )}

      {hasSpellEffects(spell) && (
        <SpellSustainTargetToggle
          value={target}
          onChange={(newTarget) => dispatch(Actions.spells.setSpellSustainTarget({ id: spell.id, target: newTarget }))}
        />
      )}

      <Button
        variant="outlined"
        color={spell.sustained ? "secondary" : "primary"}
        fullWidth
        startIcon={spell.sustained ? <Icons.spell.stopSustaining /> : <Icons.spell.startSustaining />}
        onClick={handleToggleSustained}
      >
        {spell.sustained ? "Stop Sustaining" : "Start Sustaining"}
      </Button>
    </Stack>
  )
}
