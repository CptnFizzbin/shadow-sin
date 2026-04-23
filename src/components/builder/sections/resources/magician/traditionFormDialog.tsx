import { InputAdornment, Paper } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useTraditionForm } from "#/components/builder/sections/resources/magician/useTraditionForm.ts"
import { Label } from "#/components/ui/text/label.tsx"
import { noop } from "#/lib/noop.ts"
import type { TraditionData } from "#/system/magic/traditionData.ts"
import {
  drainAttributeSelectOptions,
  spiritTypeSelectOptions,
} from "#/system/magic/traditionData.ts"

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
          <Stack>
            <form.AppField name="name">
              {(field) => (
                <field.TextField label="Name" required autoFocus />
              )}
            </form.AppField>

            <form.AppField name="drainAttribute">
              {(field) => (
                <field.SelectField
                  label="Drain Resist"
                  required
                  options={drainAttributeSelectOptions}
                  slotProps={{
                    select: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ marginRight: 1 }}>
                          Willpower +
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            </form.AppField>

            <Paper>
              <Stack sx={{ padding: 1 }}>
                <Label label="Spirit Types" variant="outlined" />

                <form.AppField name="spiritTypes.combat">
                  {(field) => (
                    <field.SelectField label="Combat" required options={spiritTypeSelectOptions} />
                  )}
                </form.AppField>

                <form.AppField name="spiritTypes.detection">
                  {(field) => (
                    <field.SelectField label="Detection" required options={spiritTypeSelectOptions} />
                  )}
                </form.AppField>

                <form.AppField name="spiritTypes.health">
                  {(field) => (
                    <field.SelectField label="Health" required options={spiritTypeSelectOptions} />
                  )}
                </form.AppField>

                <form.AppField name="spiritTypes.illusion">
                  {(field) => (
                    <field.SelectField label="Illusion" required options={spiritTypeSelectOptions} />
                  )}
                </form.AppField>

                <form.AppField name="spiritTypes.manipulation">
                  {(field) => (
                    <field.SelectField label="Manipulation" required options={spiritTypeSelectOptions} />
                  )}
                </form.AppField>
              </Stack>
            </Paper>

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
