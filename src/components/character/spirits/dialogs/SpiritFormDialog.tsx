import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { SpiritFormFields } from "#/components/character/spirits/form/SpiritFormFields.tsx"
import { useSpiritForm } from "#/components/character/spirits/form/useSpiritForm.ts"
import { SummoningSection } from "#/components/character/spirits/summoningSection.tsx"
import type { SpiritData, SpiritType } from "#/system/magic/spiritData.ts"

interface SpiritFormDialogProps {
  open: boolean
  spirit?: SpiritData
  onClose: (result?: SpiritData) => void
  onClosed?: () => void
}

export const SpiritFormDialog: FC<SpiritFormDialogProps> = ({
  open,
  onClose,
  onClosed,
  spirit,
}) => {
  const tradition = useCharacterSheet((s) => s.tradition)

  const form = useSpiritForm({
    spirit,
    onSubmit: (values) => onClose(values),
  })

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      slotProps={{ transition: { onExited: onClosed } }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{spirit ? "Edit Spirit" : "Summon Spirit"}</DialogTitle>
      <DialogContent>
        <Stack sx={{ gap: 2, pt: 1 }}>
          <SpiritFormFields form={form} tradition={tradition} />
          <Divider />
          <form.Subscribe selector={(state): [SpiritType, number, boolean] => [state.values.spiritType, state.values.force, state.values.bound]}>
            {([spiritType, force, bound]) => <SummoningSection spiritType={spiritType} force={force} isBound={bound} />}
          </form.Subscribe>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <form.Subscribe selector={(state): [boolean, boolean] => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              disabled={!canSubmit || isSubmitting}
              onClick={form.handleSubmit}
              variant="contained"
            >
              Save
            </Button>
          )}
        </form.Subscribe>
      </DialogActions>
    </Dialog>
  )
}
