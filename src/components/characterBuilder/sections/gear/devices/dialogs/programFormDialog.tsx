import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { ProgramFormFields } from "#/components/characterBuilder/sections/gear/devices/forms/programFormFields.tsx"
import {
  programFieldMap,
  useProgramForm,
} from "#/components/characterBuilder/sections/gear/devices/forms/useProgramForm.tsx"
import type { ProgramData } from "#/lib/system/gear/programData.ts"

interface ProgramFormDialogProps {
  open: boolean
  program?: ProgramData
  parentId?: UUID
  onClose: () => void
  onClosed?: () => void
  onSave?: (program: ProgramData) => void
}

export const ProgramFormDialog: FC<ProgramFormDialogProps> = ({
  open,
  program,
  parentId,
  onClose,
  onClosed,
  onSave,
}) => {
  const title = program ? "Edit Program" : "Add Program"

  const form = useProgramForm({
    program,
    parentId,
    onSubmit: (submittedProgram) => {
      onSave?.(submittedProgram)
    },
  })

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack gap={1} sx={{ padding: 1 }}>
          <ProgramFormFields form={form} fields={programFieldMap} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ padding: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          onClick={() => form.handleSubmit()}
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
