import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"

import { useConfirmDialog } from "#/components/dialogs/confirmDialog.tsx"
import type { ContactData } from "#/system/contactData.ts"

import { ContactRow } from "./contactsListItem.tsx"
import { useContactFormDialog } from "./form/contactFormDialog.tsx"
import { useContactsStore } from "./useContactsStore.ts"

interface ContactsListProps {
  contacts: ContactData[]
  emptyState?: ReactNode
}

export const ContactsList: FC<ContactsListProps> = ({
  contacts,
  emptyState,
}) => {
  const confirmDialog = useConfirmDialog()
  const contactFormDialog = useContactFormDialog()
  const contactsStore = useContactsStore()

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
    <Stack sx={{ gap: 1 }}>
      {contacts.length === 0 && (emptyState || (
        <Typography color="text.secondary" sx={{ pl: 1 }}>
          No contacts added
        </Typography>
      ))}

      {contacts.map((contact) => (
        <ContactRow
          key={contact.id}
          contact={contact}
          onClick={() => contactFormDialog.open({ contact })}
          onRemove={() => onRemove(contact)}
        />
      ))}

      <Button
        variant="outlined"
        color="secondary"
        startIcon={<RiAddLine />}
        onClick={() => contactFormDialog.open()}
        size="small"
      >
        Add Contact
      </Button>
    </Stack>
  )
}
