import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { ContactFormDialog } from "#/components/Character/Form/Contacts/ContactFormDialog.tsx"
import { useContactsFormGroup } from "#/components/Character/Form/Contacts/UseContactsFormGroup.ts"
import type { ContactData } from "#/lib/system/types/contactData.ts"

type DialogState =
  | null
  | { mode: "create"; open: boolean }
  | { mode: "edit"; contact: ContactData; open: boolean }

export const ContactsSection: FC = () => {
  const [dialogState, setDialogState] = useState<DialogState>(null)
  const { contacts, bpSpent, addContact, updateContact, removeContact } =
    useContactsFormGroup()

  const onDialogClose = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const onDialogClosed = () => {
    setDialogState(null)
  }

  const handleAddContact = (contact: ContactData) => {
    addContact(contact)
    onDialogClose()
  }

  const handleUpdateContact = (contact: ContactData) => {
    updateContact(contact)
    onDialogClose()
  }

  const handleRemoveContact = (contact: ContactData) => {
    removeContact(contact)
    onDialogClose()
  }

  return (
    <>
      <Stack gap={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="caption" color="text.secondary">
            BP spent on contacts: {bpSpent}
          </Typography>
        </Stack>

        {contacts.length === 0 ? (
          <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
            No contacts added
          </Typography>
        ) : (
          <Stack gap={0.5}>
            {contacts.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                onClick={() =>
                  setDialogState({ mode: "edit", contact, open: true })
                }
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

interface ContactRowProps {
  contact: ContactData
  onClick: () => void
  onRemove: () => void
}

const ContactRow: FC<ContactRowProps> = ({ contact, onClick, onRemove }) => {
  const bpCost = contact.connection + contact.loyalty

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      sx={{
        padding: 1,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onClick}
    >
      <Stack sx={{ flexGrow: 1 }} gap={0.5}>
        <Typography sx={{ fontSize: "0.875rem" }}>{contact.name}</Typography>
        <Stack direction="row" gap={0.5}>
          <Chip
            label={`Con: ${contact.connection}`}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
          <Chip
            label={`Loy: ${contact.loyalty}`}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
          <Chip
            label={`${bpCost} BP`}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
        </Stack>
        {contact.notes && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.7rem" }}
          >
            {contact.notes}
          </Typography>
        )}
      </Stack>

      <IconButton
        size="small"
        color="error"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
      >
        <RiDeleteBin6Line size={16} />
      </IconButton>
    </Stack>
  )
}
