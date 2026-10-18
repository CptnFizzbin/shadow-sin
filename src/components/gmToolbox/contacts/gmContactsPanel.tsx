import DownloadIcon from "@mui/icons-material/Download"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { useContactFormDialog } from "#/components/runner/sections/contacts/viewer/form/contactFormDialog.tsx"
import {
  contactsDataPacket,
  DataPacketExtension,
  dataPacketToYaml,
} from "#/components/system/exportImport/dataPacketUtils.ts"
import { downloadTextFile, toFileNameSlug } from "#/components/system/exportImport/exportUtils.ts"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { useGmContacts, useGmContactsDispatch } from "#/services/gmContacts/gmContactsStore.ts"
import { addContact, removeContact, updateContact } from "#/state/runner/contacts/contacts.actions.ts"
import type { ContactData } from "#/system/model/contacts/contactData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

import { GmContactRow } from "./gmContactRow.tsx"

export const GmContactsPanel: FC = () => {
  const contacts = useGmContacts()
  const dispatch = useGmContactsDispatch()
  const contactFormDialog = useContactFormDialog()
  const confirmDialog = useConfirmDialog()
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<UUID>>(new Set())

  const selectedContacts = contacts.filter((contact) => selectedIds.has(contact.id))
  const allSelected = contacts.length > 0 && selectedContacts.length === contacts.length

  const onSubmit = (contact: ContactData) => {
    if (contact.id === NullUuid) {
      dispatch(addContact(contact))
    } else {
      dispatch(updateContact(contact))
    }
  }

  const onRemove = async (contact: ContactData) => {
    if (await confirmDialog.confirm({
      title: `Remove ${contact.name}?`,
      body: "Are you sure you want to remove this contact? This action cannot be undone.",
      confirmLabel: "Remove",
    })) {
      dispatch(removeContact(contact.id))
    }
  }

  const toggleSelected = (contactId: UUID) => {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      if (next.has(contactId)) next.delete(contactId)
      else next.add(contactId)
      return next
    })
  }

  const toggleAllSelected = () => {
    setSelectedIds(allSelected ? new Set() : new Set(contacts.map((contact) => contact.id)))
  }

  const onExport = () => {
    const isoDate = new Date().toISOString().slice(0, 10)
    const baseName = selectedContacts.length === 1 ? toFileNameSlug(selectedContacts[0].name) || "contact" : "contacts"
    const yamlContent = dataPacketToYaml(contactsDataPacket(selectedContacts))
    downloadTextFile(yamlContent, `${baseName}.${isoDate}.${DataPacketExtension}`)
  }

  return (
    <Stack>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <FormControlLabel
          label="Select all"
          disabled={contacts.length === 0}
          control={(
            <Checkbox
              checked={allSelected}
              indeterminate={selectedContacts.length > 0 && !allSelected}
              onChange={toggleAllSelected}
            />
          )}
        />

        <Button
          variant="outlined"
          color="info"
          size="small"
          startIcon={<DownloadIcon />}
          disabled={selectedContacts.length === 0}
          onClick={onExport}
        >
          {`Export (${selectedContacts.length})`}
        </Button>
      </Stack>

      {contacts.length === 0 && (
        <Typography color="text.secondary" sx={{ pl: 1 }}>
          No contacts yet. Add one, then export it as a data packet for your players to import.
        </Typography>
      )}

      {contacts.map((contact) => (
        <GmContactRow
          key={contact.id}
          contact={contact}
          selected={selectedIds.has(contact.id)}
          onToggleSelected={() => toggleSelected(contact.id)}
          onEdit={() => contactFormDialog.open({ contact, onSubmit })}
          onRemove={() => onRemove(contact)}
        />
      ))}

      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine />}
        onClick={() => contactFormDialog.open({ onSubmit })}
      >
        Add Contact
      </Button>

      {confirmDialog.outlet}
      {contactFormDialog.outlet}
    </Stack>
  )
}
