import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useId } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { contactFieldMap, useContactForm } from "#/hooks/runner/contacts/form/useContactForm.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { ContactData } from "#/system/model/contacts/contactData.ts"

import { ContactFormFields } from "./contactFormFields.tsx"

interface ContactFormDialogProps extends ControlledDialogProps<void> {
  contact?: ContactData
  /** Persists the submitted contact; a new contact arrives with `NullUuid` as its `id`. */
  onSubmit: (contact: ContactData) => void
}

const ContactFormDialog: FC<ContactFormDialogProps> = ({
  ctrl,
  contact,
  onSubmit,
}) => {
  const isEditMode = !!contact
  const title = isEditMode ? "Edit Contact" : "Add Contact"
  const formId = useId()

  const handleSubmit = (savedContact: ContactData) => {
    onSubmit(savedContact)
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
          <Stack sx={{ padding: 1 }}>
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

type UseContactFormDialogProps = Omit<ContactFormDialogProps, keyof ControlledDialogProps<void>>

export const useContactFormDialog = () => useDialog<void, UseContactFormDialogProps>(
  (ctrl, props) => <ContactFormDialog ctrl={ctrl} {...props} />,
)
