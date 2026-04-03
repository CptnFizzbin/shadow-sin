import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import { useState } from "react"

import { ContactsList } from "#/components/Contacts/contacts-list.tsx"
import { useContactsStore } from "#/components/Contacts/use-contacts-store.ts"
import { filterBySearch, SearchField } from "#/components/UI/search/search-field.tsx"

export const Route = createFileRoute("/$characterId/contacts")({
  component: RouteComponent,
})

function RouteComponent() {
  const contactsStore = useContactsStore()
  const allContacts = useStore(contactsStore, (contacts) => contacts)
  const [searchQuery, setSearchQuery] = useState("")

  let filteredContacts = allContacts
  if (searchQuery !== "") {
    const terms = searchQuery.split(/\s+/)
      .filter(Boolean)
      .map((term) => term.toLowerCase())

    filteredContacts = allContacts
      .filter(filterBySearch((contact) => [contact.name], terms))
  }

  return (
    <Stack gap={1}>
      <SearchField value={searchQuery} onChange={setSearchQuery} placeholder="Search contacts..." />

      <ContactsList
        contacts={filteredContacts}
        emptyState={searchQuery && (
          <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
            No matching contacts found
          </Typography>
        )}
      />
    </Stack>
  )
}
