import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useId } from "react"

import { ContactFormFields } from "#/components/contacts/form/contactFormFields.tsx"
import { contactFieldMap, useContactForm } from "#/components/contacts/form/useContactForm.tsx"
import { useContactsStore } from "#/components/contacts/useContactsStore.ts"
import { noop } from "#/lib/noop.ts"
import type { ContactData } from "#/lib/system/contactData.ts"

export interface ContactFormDialogProps {
  open: boolean
  contact?: ContactData
  onSaved?: (contact: ContactData) => void
  onClose: () => void
  onClosed?: () => void
}

export const ContactFormDialog: FC<ContactFormDialogProps> = ({
  open,
  contact,
  onSaved,
  onClose,
  onClosed = noop,
}) => {
  const isEditMode = !!contact
  const title = isEditMode ? "Edit Contact" : "Add Contact"
  const contactStore = useContactsStore()
  const formId = useId()

  const handleSubmit = (savedContact: ContactData) => {
    const persistedContact = contactStore.save(savedContact)
    onSaved?.(persistedContact)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  const handleClosed = () => {
    form.reset()
    onClosed?.()
  }

  const form = useContactForm({
    contact,
    onSubmit: handleSubmit,
  })

  return (
    <Dialog
      open={open}
      onTransitionExited={handleClosed}
      fullWidth
    >
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <Stack gap={1} sx={{ padding: 1 }}>
            <ContactFormFields form={form} fields={contactFieldMap} />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ padding: 1 }}>
        <Button
          color="secondary"
          onClick={handleCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          color="secondary"
          variant="contained"
          form={formId}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
