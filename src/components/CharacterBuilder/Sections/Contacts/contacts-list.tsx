import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { ContactFormDialog } from "#/components/CharacterBuilder/Sections/Contacts/contact-form-dialog.tsx"
import { ContactRow } from "#/components/CharacterBuilder/Sections/Contacts/contacts-list-item.tsx"
import { getContactBpCost } from "#/components/Contacts/contacts-utils.ts"
import { useContactsStore } from "#/components/Contacts/use-contacts-store.ts"
import { BuildPoints } from "#/components/UI/build-points.tsx"
import type { ContactData } from "#/lib/system/contact-data.ts"

type DialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", contact: ContactData, open: boolean }

export const ContactsList: FC = () => {
  const [dialogState, setDialogState] = useState<DialogState>(null)
  const contactsStore = useContactsStore()
  const contacts = useStore(contactsStore, (state) => state)
  const bpSpent = contacts
    .map((contact) => getContactBpCost(contact))
    .reduce((sum, cost) => sum + cost, 0)

  const onDialogClose = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const onDialogClosed = () => {
    setDialogState(null)
  }

  const handleAddContact = (contact: ContactData) => {
    contactsStore.save(contact)
    onDialogClose()
  }

  const handleUpdateContact = (contact: ContactData) => {
    contactsStore.save(contact)
    onDialogClose()
  }

  const handleRemoveContact = (contact: ContactData) => {
    contactsStore.remove(contact)
    onDialogClose()
  }

  return (
    <>
      <Stack gap={1}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center">
          <BuildPoints value={bpSpent} />
        </Stack>

        {contacts.length === 0
          ? (
              <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
                No contacts added
              </Typography>
            )
          : (
              <Stack gap={0.5}>
                {contacts.map((contact) => (
                  <ContactRow
                    key={contact.id}
                    contact={contact}
                    onClick={() =>
                      setDialogState({ mode: "edit", contact, open: true })}
                    onRemove={() => handleRemoveContact(contact)}
                  />
                ))}
              </Stack>
            )}

        <Button
          variant="outlined"
          color="secondary"
          startIcon={<RiAddLine />}
          onClick={() => setDialogState({ mode: "create", open: true })}
          size="small"
        >
          Add Contact
        </Button>
      </Stack>

      {dialogState?.mode === "create" && (
        <ContactFormDialog
          open={dialogState.open}
          onSave={handleAddContact}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}

      {dialogState?.mode === "edit" && (
        <ContactFormDialog
          open={dialogState.open}
          contact={dialogState.contact}
          onSave={handleUpdateContact}
          onDelete={() => handleRemoveContact(dialogState.contact)}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}
    </>
  )
}
