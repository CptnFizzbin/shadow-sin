import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { SpellsSelectors } from "#/state/runner/spells/spells.selector.ts"
import { hasSpellEffects } from "#/system/formulas/magic/spellSustaining.ts"
import { SpellSustainTarget } from "#/system/model/magic/spellData.ts"
import { Icons } from "#/utils/icons.ts"

import { SpellSustainTargetToggle } from "./spellSustainTargetToggle.tsx"

interface SpellSustainSectionProps {
  spellId: string
}

/**
 * Starts or stops sustaining a sustainable Spell from its cast dialog. For a Spell with effects it
 * also picks who the Spell is sustained on, which takes effect immediately while it is sustained.
 */
export const SpellSustainSection: FC<SpellSustainSectionProps> = ({ spellId }) => {
  const spells = useRunnerSelector(SpellsSelectors.selectAll)
  const dispatch = useRunnerStoreDispatch()

  // The cast dialog only holds the Spell as it was when opened, so read it live to reflect the toggles below.
  const spell = spells.find((candidate) => candidate.id === spellId)
  if (!spell) return null

  const target = spell.sustainedOn ?? SpellSustainTarget.Self

  const handleToggleSustained = () => {
    if (spell.sustained) dispatch(Actions.spells.stopSustainingSpell(spell.id))
    else dispatch(Actions.spells.startSustainingSpell({ id: spell.id, target }))
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <Label label={spell.sustained ? "Sustaining" : "Sustain"} variant="text" />

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
