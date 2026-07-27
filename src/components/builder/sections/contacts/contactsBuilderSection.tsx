import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useContactsAlerts } from "#/components/builder/alerts/hooks/useContactsAlerts.ts"
import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { ContactsList } from "#/components/runner/contacts/contactsList.tsx"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

import { getContactBpCost } from "./contactsBuilderUtils.ts"

export const ContactsBuilderSection: FC = () => {
  const allContacts = useRunnerStoreSelector(Selectors.contacts.selectContacts)
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
