import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { SpellSustainTargetToggle } from "#/components/runner/awakenings/magician/viewer/spells/spellSustainTargetToggle.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { SpellData } from "#/system/model/magic/spellData.ts"
import { SpellSustainTarget } from "#/system/model/magic/spellData.ts"

interface SustainSpellDialogProps extends ControlledDialogProps<SpellSustainTarget> {
  spell: SpellData
}

const SustainSpellDialog: FC<SustainSpellDialogProps> = ({ ctrl, spell }) => {
  const [target, setTarget] = useState(spell.sustainedOn ?? SpellSustainTarget.Self)

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="xs">
      <Dialog.Title>Sustain {spell.name}</Dialog.Title>
      <Dialog.Content>
        <Stack>
          <Typography color="text.secondary">
            Who is this spell sustained on? Its effects only apply to you while it is sustained on yourself.
          </Typography>
          <SpellSustainTargetToggle value={target} onChange={setTarget} />
        </Stack>
      </Dialog.Content>
      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>Cancel</Button>
        <Button variant="contained" onClick={() => ctrl.close(target)}>Sustain</Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

interface UseSustainSpellDialogProps {
  spell: SpellData
}

/** Asks who a Spell is being sustained on; resolves to the chosen target, or `undefined` when cancelled. */
export const useSustainSpellDialog = () => useDialog<SpellSustainTarget, UseSustainSpellDialogProps>(
  (ctrl, props) => <SustainSpellDialog ctrl={ctrl} spell={props.spell} />,
)
