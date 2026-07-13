import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useId } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
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
  const dispatch = useRunnerStoreDispatch()
  const formId = useId()

  const handleSubmit = (savedContact: ContactData) => {
    let persistedContact: ContactData
    if (!savedContact.id || savedContact.id === NullUuid) {
      const action = Actions.contacts.addContact(savedContact)
      dispatch(action)
      persistedContact = action.payload
    } else {
      dispatch(Actions.contacts.updateContact(savedContact))
      persistedContact = savedContact
    }
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
    <ControlledDialog ctrl={ctrl} onClose={false} onClosed={handleClosed}>
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

export const useContactFormDialog = () => useDialog<void, UseContactFormDialogProps | undefined>(
  (ctrl, props) => <ContactFormDialog ctrl={ctrl} {...props} />,
)
