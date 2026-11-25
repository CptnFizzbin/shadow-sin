import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { SpellSustainTargetToggle } from "#app/components/runner/awakenings/magician/viewer/spells/spellSustainTargetToggle.tsx"
import { SustainingFocusSelect } from "#app/components/runner/awakenings/magician/viewer/spells/sustainingFocusSelect.tsx"
import type { FocusData } from "#data/items/magicalData.ts"
import type { SpellData } from "#data/magic/spellData.ts"
import { SpellSustainTarget } from "#data/magic/spellData.ts"
import { hasSpellEffects } from "#rules/magic/spellSustaining.ts"
import type { ControlledDialogProps } from "#ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#ui/dialog/dialog.tsx"
import { useDialog } from "#ui/dialog/useDialog.tsx"

/** How a Spell is to be sustained: who it's on, and the Sustaining Focus holding it (`null` for the caster). */
interface SustainSpellChoice {
  target: SpellSustainTarget
  sustainedBy: string | null
}

interface SustainSpellDialogProps extends ControlledDialogProps<SustainSpellChoice> {
  spell: SpellData
  sustainingFoci: FocusData[]
}

const SustainSpellDialog: FC<SustainSpellDialogProps> = ({ ctrl, spell, sustainingFoci }) => {
  const [target, setTarget] = useState(spell.sustainedOn ?? SpellSustainTarget.Self)
  const [sustainedBy, setSustainedBy] = useState<string | null>(null)

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="xs">
      <Dialog.Title>Sustain {spell.name}</Dialog.Title>
      <Dialog.Content>
        <Stack>
          {hasSpellEffects(spell) && (
            <>
              <Typography color="text.secondary">
                Who is this spell sustained on? Its effects only apply to you while it is sustained on yourself.
              </Typography>
              <SpellSustainTargetToggle value={target} onChange={setTarget} />
            </>
          )}
          {sustainingFoci.length > 0 && (
            <SustainingFocusSelect foci={sustainingFoci} value={sustainedBy} onChange={setSustainedBy} />
          )}
        </Stack>
      </Dialog.Content>
      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>Cancel</Button>
        <Button variant="contained" onClick={() => ctrl.close({ target, sustainedBy })}>Sustain</Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

interface UseSustainSpellDialogProps {
  spell: SpellData
  /** The Sustaining Foci free to hold the Spell; the focus picker shows only when there are some. */
  sustainingFoci: FocusData[]
}

/**
 * Asks who a Spell is being sustained on and, when a Sustaining Focus is free, whether one holds it;
 * resolves to the choice, or `undefined` when cancelled.
 */
export const useSustainSpellDialog = () => useDialog<SustainSpellChoice, UseSustainSpellDialogProps>(
  (ctrl, props) => <SustainSpellDialog ctrl={ctrl} spell={props.spell} sustainingFoci={props.sustainingFoci} />,
)
