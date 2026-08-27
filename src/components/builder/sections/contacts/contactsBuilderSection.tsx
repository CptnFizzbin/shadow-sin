import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { ContactsList } from "#/components/runner/contacts/contactsList.tsx"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { useContactsAlerts } from "#/hooks/builder/alerts/useContactsAlerts.ts"
import { ContactsSelectors } from "#/stores/runner/contacts/contactsSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

import { getContactBpCost } from "./contactsBuilderUtils.ts"

export const ContactsBuilderSection: FC = () => {
  const allContacts = useRunnerSelector(ContactsSelectors.selectAll)
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
