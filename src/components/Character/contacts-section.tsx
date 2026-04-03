import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiSearchLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { ContactFormDialog } from "#/components/CharacterBuilder/Sections/Contacts/contact-form-dialog.tsx"
import { ContactRow } from "#/components/CharacterBuilder/Sections/Contacts/contacts-list-item.tsx"
import { useContactsStore } from "#/components/Contacts/use-contacts-store.ts"
import type { ContactData } from "#/lib/system/contact-data.ts"

type DialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", contact: ContactData, open: boolean }

export const ContactsSection: FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogState, setDialogState] = useState<DialogState>(null)
  const contactsStore = useContactsStore()
  const contacts = useStore(contactsStore, (state) => state)

  const filteredContacts = contacts.filter((contact) => {
    const query = searchQuery.toLowerCase()
    return (
      contact.name.toLowerCase().includes(query)
      || (contact.role?.toLowerCase().includes(query) ?? false)
      || (contact.notes?.toLowerCase().includes(query) ?? false)
    )
  })

  const onDialogClose = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const onDialogClosed = () => {
    setDialogState(null)
  }

  const handleAddContact = (contact: ContactData) => {
    contactsStore.add(contact)
    onDialogClose()
  }

  const handleUpdateContact = (contact: ContactData) => {
    contactsStore.update(contact.id, () => contact)
    onDialogClose()
  }

  const handleRemoveContact = (contact: ContactData) => {
    contactsStore.remove(contact)
    onDialogClose()
  }

  return (
    <>
      <Stack gap={1}>
        <TextField
          placeholder="Search contacts…"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <RiSearchLine size={18} />
                </InputAdornment>
              ),
            },
          }}
        />

        {contacts.length === 0
          ? (
              <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
                No contacts added
              </Typography>
            )
          : filteredContacts.length === 0
            ? (
                <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
                  No contacts match your search
                </Typography>
              )
            : (
                <Stack gap={0.5}>
                  {filteredContacts.map((contact) => (
                    <ContactRow
                      key={contact.id}
                      contact={contact}
                      onClick={() => setDialogState({ mode: "edit", contact, open: true })}
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
