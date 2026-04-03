import Stack from "@mui/material/Stack"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import { useContactsAlerts } from "#/components/CharacterBuilder/Alerts/Hooks/use-contacts-alerts.ts"
import { getContactBpCost } from "#/components/CharacterBuilder/Sections/Contacts/contacts-builder-utils.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/builder-section.tsx"
import { ContactsList } from "#/components/Contacts/contacts-list.tsx"
import { useContactsStore } from "#/components/Contacts/use-contacts-store.ts"
import { BuildPoints } from "#/components/UI/build-points.tsx"

export const ContactsBuilderSection: FC = () => {
  const contactsStore = useContactsStore()
  const allContacts = useStore(contactsStore, (contacts) => contacts)
  const contactsAlerts = useContactsAlerts()

  const bpSpent = allContacts
    .map((contact) => getContactBpCost(contact))
    .reduce((sum, cost) => sum + cost, 0)

  return (
    <BuilderSection id={BuilderSectionId.contacts} alerts={contactsAlerts}>
      <Stack direction="row" justifyContent="flex-end" alignItems="center">
        <BuildPoints value={bpSpent} />
      </Stack>

      <ContactsList contacts={allContacts} />
    </BuilderSection>
  )
}
