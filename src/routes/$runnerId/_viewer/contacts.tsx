import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { ContactsList } from "#/components/runner/contacts/contactsList.tsx"
import { filterBySearch, SearchField } from "#/components/ui/search/searchField.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const Route = createFileRoute("/$runnerId/_viewer/contacts")({
  component: RouteComponent,
})

/**
 * Render the contacts route UI: a search field and a contacts list filtered by the current query.
 *
 * The list is filtered by whitespace-separated, case-insensitive terms typed into the search field.
 * When a search is active and no contacts match, a caption "No matching contacts found" is shown as the list's empty state.
 *
 * @returns The route component's React elements containing the search control and the filtered contacts list.
 */
function RouteComponent() {
  const allContacts = useRunnerStoreSelector(Selectors.contacts.selectContacts)
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
    <Stack>
      <SectionHeader>Contacts</SectionHeader>

      <SearchField value={searchQuery} onChange={setSearchQuery} placeholder="Search contacts..." />

      <ContactsList
        contacts={filteredContacts}
        emptyState={searchQuery && (
          <Typography color="text.secondary" sx={{ pl: 1 }}>
            No matching contacts found
          </Typography>
        )}
      />
    </Stack>
  )
}
