import Stack from "@mui/material/Stack"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { useContactsAlerts } from "#/components/builder/alerts/hooks/useContactsAlerts.ts"
import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { ContactsList } from "#/components/character/contacts/contactsList.tsx"
import { selectAllContacts } from "#/components/character/contacts/contactsSelectors.ts"
import { useContactsStore } from "#/components/character/contacts/useContactsStore.ts"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"

import { getContactBpCost } from "./contactsBuilderUtils.ts"

export const ContactsBuilderSection: FC = () => {
  const contactsStore = useContactsStore()
  const allContacts = useSelector(contactsStore, selectAllContacts)
  const contactsAlerts = useContactsAlerts()

  const bpSpent = allContacts
    .map((contact) => getContactBpCost(contact))
    .reduce((sum, cost) => sum + cost, 0)

  return (
    <BuilderSection id={BuilderSectionId.contacts} alerts={contactsAlerts}>
      <Stack direction="row" sx={{ justifyContent: "flex-end", alignItems: "center" }}>
        <BuildPoints value={bpSpent} />
      </Stack>

      <ContactsList contacts={allContacts} />
    </BuilderSection>
  )
}
