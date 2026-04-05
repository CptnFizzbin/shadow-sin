import Stack from "@mui/material/Stack"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import { useContactsAlerts } from "#/components/characterBuilder/alerts/hooks/useContactsAlerts.ts"
import { BuilderSection } from "#/components/characterBuilder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import { getContactBpCost } from "#/components/characterBuilder/sections/contacts/contactsBuilderUtils.ts"
import { ContactsList } from "#/components/contacts/contactsList.tsx"
import { useContactsStore } from "#/components/contacts/useContactsStore.ts"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"

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
