import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import {
  useTraditionForm,
} from "#/components/CharacterBuilder/Sections/Resources/Magician/UseTraditionForm.ts"
import { noop } from "#/lib/noop.ts"
import type { TraditionData } from "#/lib/system/magic/traditionData.ts"
import { drainAttributeSelectOptions } from "#/lib/system/magic/traditionData.ts"

export interface TraditionFormDialogProps {
  open: boolean
  tradition?: TraditionData
  onSave: (tradition: TraditionData) => void
  onClose: () => void
  onClosed?: () => void
}

export const TraditionFormDialog: FC<TraditionFormDialogProps> = ({
  open,
  tradition,
  onSave,
  onClose,
  onClosed = noop,
}) => {
  const form = useTraditionForm({
    tradition,
    onSubmit: (updatedTradition) => {
      onSave(updatedTradition)
      onClose()
    },
  })

  return (
    <Dialog
      open={open}
      onTransitionExited={() => {
        form.reset()
        onClosed()
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Tradition</DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <form.AppForm>
          <Stack gap={2} sx={{ pt: 1 }}>
            <form.AppField name="name">
              {(field) => (
                <field.TextField label="Name" required autoFocus />
              )}
            </form.AppField>

            <Divider>
              <Typography variant="caption" color="text.secondary">
                Spirit Types
              </Typography>
            </Divider>

            <Stack gap={2}>
              <form.AppField name="spiritTypes.combat">
                {(field) => (
                  <field.TextField label="Combat" placeholder="e.g. Fire, Beast, Warrior" required />
                )}
              </form.AppField>

              <form.AppField name="spiritTypes.detection">
                {(field) => (
                  <field.TextField label="Detection" placeholder="e.g. Water, Bird, Sun" required />
                )}
              </form.AppField>

              <form.AppField name="spiritTypes.health">
                {(field) => (
                  <field.TextField label="Health" placeholder="e.g. Man, Forest" required />
                )}
              </form.AppField>

              <form.AppField name="spiritTypes.illusion">
                {(field) => (
                  <field.TextField label="Illusion" placeholder="e.g. Air, Ghost, Wolf" required />
                )}
              </form.AppField>

              <form.AppField name="spiritTypes.manipulation">
                {(field) => (
                  <field.TextField label="Manipulation" placeholder="e.g. Earth, Machine" required />
                )}
              </form.AppField>
            </Stack>

            <Divider>
              <Typography variant="caption" color="text.secondary">
                Drain
              </Typography>
            </Divider>

            <form.AppField name="drainAttribute">
              {(field) => (
                <field.SelectField
                  label="Willpower + Attribute"
                  required
                  options={drainAttributeSelectOptions}
                />
              )}
            </form.AppField>

            <form.AppField name="concept">
              {(field) => (
                <field.TextField label="Concept (optional)" multiline rows={2} />
              )}
            </form.AppField>
          </Stack>
        </form.AppForm>
      </DialogContent>
      <DialogActions>
        <Box>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={() => form.handleSubmit()}>
            Save
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
