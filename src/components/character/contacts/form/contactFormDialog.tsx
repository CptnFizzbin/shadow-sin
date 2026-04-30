import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useId } from "react"

import { useContactsStore } from "#/components/character/contacts/useContactsStore.ts"
import type { ControlledDialogProps } from "#/components/dialogs/api/controlledDialogProps.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import type { ContactData } from "#/system/contactData.ts"

import { ContactFormFields } from "./contactFormFields.tsx"
import { contactFieldMap, useContactForm } from "./useContactForm.tsx"

interface ContactFormDialogProps extends ControlledDialogProps<void> {
  contact?: ContactData
  onSaved?: (contact: ContactData) => void
}

const ContactFormDialog: FC<ContactFormDialogProps> = ({
  ctrl,
  contact,
  onSaved,
}) => {
  const isEditMode = !!contact
  const title = isEditMode ? "Edit Contact" : "Add Contact"
  const contactStore = useContactsStore()
  const formId = useId()

  const handleSubmit = (savedContact: ContactData) => {
    const persistedContact = contactStore.save(savedContact)
    onSaved?.(persistedContact)
    ctrl.close()
  }

  const form = useContactForm({
    contact,
    onSubmit: handleSubmit,
  })

  const handleClosed = () => {
    form.reset()
  }

  return (
    <ControlledDialog ctrl={ctrl} onClosed={handleClosed}>
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
          onClick={() => ctrl.close()}
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
    </ControlledDialog>
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
      (ctrl) => <ContactFormDialog ctrl={ctrl} {...props} />,
    ),
  }
}
