import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { BuildPoints } from "#/components/builder/buildPoints.tsx"
import { BuilderSection } from "#/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { ContactsList } from "#/components/runner/sections/contacts/viewer/contactsList.tsx"
import { useContactsAlerts } from "#/hooks/builder/alerts/useContactsAlerts.ts"
import { ContactsSelectors } from "#/state/runner/contacts/contacts.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

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
