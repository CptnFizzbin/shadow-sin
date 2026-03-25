import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { ContactFormFields } from "#/components/Character/Form/Contacts/ContactFormFields.tsx"
import type { ContactFormOptions } from "#/components/Character/Form/Contacts/UseContactForm.tsx"
import {
  contactFieldMap,
  useContactForm,
} from "#/components/Character/Form/Contacts/UseContactForm.tsx"
import { noop } from "#/lib/noop.ts"
import type { ContactData } from "#/lib/system/types/contactData.ts"

export interface ContactFormDialogProps {
  open: boolean
  contact?: ContactData
  onSave: (contact: ContactData) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

export const ContactFormDialog: FC<ContactFormDialogProps> = ({
  open,
  contact,
  onSave,
  onDelete,
  onClose,
  onClosed = noop,
}) => {
  const editMode = !!contact

  const formOptions: ContactFormOptions = editMode
    ? { mode: "edit", contact, onSubmit: (c) => onSave(c) }
    : { mode: "create", onSubmit: (c) => onSave(c) }

  const form = useContactForm(formOptions)

  const title = editMode ? "Edit Contact" : "Add Contact"

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
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <Stack gap={1} sx={{ padding: 1 }}>
          <ContactFormFields form={form} fields={contactFieldMap} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: 1 }}>
        <Stack justifyContent="space-between" direction="row" width="100%">
          <Box>
            {onDelete && (
              <Button
                color="error"
                onClick={() => {
                  onDelete()
                  onClose()
                }}
              >
                Delete
              </Button>
            )}
          </Box>
          <Box>
            <Button color="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              onClick={() => form.handleSubmit()}
            >
              Save
            </Button>
          </Box>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
