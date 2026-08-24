import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"

import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { ContactData } from "#/system/contactData.ts"

import { ContactRow } from "./contactsListItem.tsx"
import { useLegworkInfoDialog } from "./dialogs/legworkInfoDialog.tsx"
import { useContactFormDialog } from "./form/contactFormDialog.tsx"

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
  const legworkInfoDialog = useLegworkInfoDialog()
  const dispatch = useRunnerStoreDispatch()

  const onRemove = async (contact: ContactData) => {
    if (await confirmDialog.confirm({
      title: `Remove ${contact.name}?`,
      body: "Are you sure you want to remove this contact? This action cannot be undone.",
      confirmLabel: "Remove",
    })) {
      dispatch(Actions.contacts.removeContact(contact.id))
    }
  }

  return (
    <Stack>
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
          onLegwork={() => legworkInfoDialog.open({ contact })}
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

      {confirmDialog.dialog}
      {contactFormDialog.dialog}
      {legworkInfoDialog.dialog}
    </Stack>
  )
}
