import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"
import { useState } from "react"

import { ContactRow } from "#/components/contacts/contactsListItem.tsx"
import { ContactFormDialog } from "#/components/contacts/form/contactFormDialog.tsx"
import { useContactsStore } from "#/components/contacts/useContactsStore.ts"
import { useConfirmDialog } from "#/components/ui/dialogs/useConfirmDialog.tsx"
import type { ContactData } from "#/lib/system/contactData.ts"

interface DialogState {
  open: boolean
  contact?: ContactData
}

interface ContactsListProps {
  contacts: ContactData[]
  emptyState?: ReactNode
}

export const ContactsList: FC<ContactsListProps> = ({
  contacts,
  emptyState,
}) => {
  const confirmDialog = useConfirmDialog({ id: "remove-contact-confirm" })
  const contactsStore = useContactsStore()
  const [dialogState, setDialogState] = useState<DialogState | null>(null)

  const onDialogClose = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const onDialogClosed = () => {
    setDialogState(null)
  }

  const onRemove = async (contact: ContactData) => {
    if (await confirmDialog.confirm({
      title: `Remove ${contact.name}?`,
      body: "Are you sure you want to remove this contact? This action cannot be undone.",
      confirmLabel: "Remove",
    })) {
      contactsStore.remove(contact)
    }
  }

  return (
    <>
      <Stack gap={1}>
        {contacts.length === 0 && (emptyState || (
          <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
            No contacts added
          </Typography>
        ))}

        {contacts.map((contact) => (
          <ContactRow
            key={contact.id}
            contact={contact}
            onClick={() => setDialogState({ contact, open: true })}
            onRemove={() => onRemove(contact)}
          />
        ))}

        <Button
          variant="outlined"
          color="secondary"
          startIcon={<RiAddLine />}
          onClick={() => setDialogState({ open: true })}
          size="small"
        >
          Add Contact
        </Button>
      </Stack>

      {dialogState && (
        <ContactFormDialog
          open={dialogState.open}
          contact={dialogState.contact}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}
    </>
  )
}
