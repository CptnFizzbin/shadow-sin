import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useId } from "react"

import { useContactsStore } from "#/components/character/contacts/useContactsStore.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { noop } from "#/lib/noop.ts"
import type { ContactData } from "#/system/contactData.ts"

import { ContactFormFields } from "./contactFormFields.tsx"
import { contactFieldMap, useContactForm } from "./useContactForm.tsx"

interface ContactFormDialogProps {
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

  const form = useContactForm({
    contact,
    onSubmit: handleSubmit,
  })

  const handleClosed = () => {
    form.reset()
    onClosed()
  }

  return (
    <Dialog
      open={open}
      onClosed={handleClosed}
    >
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <Stack sx={{ gap: 1, padding: 1 }}>
            <ContactFormFields form={form} fields={contactFieldMap} />
          </Stack>
        </form>
      </Dialog.Content>
      <Dialog.Actions>
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
      </Dialog.Actions>
    </Dialog>
  )
}

interface UseContactFormDialogProps {
  contact?: ContactData
  onSaved?: (contact: ContactData) => void
}

export const useContactFormDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props?: UseContactFormDialogProps) => dialogApi.open<void>(
      (dialogProps) => (
        <ContactFormDialog
          open={dialogProps.open}
          contact={props?.contact}
          onSaved={props?.onSaved}
          onClose={() => dialogProps.onClose()}
          onClosed={dialogProps.onClosed}
        />
      ),
    ),
  }
}
