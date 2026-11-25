import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { BuildPoints } from "#/app/components/builder/buildPoints.tsx"
import { BuilderSection } from "#/app/components/builder/builderSection.tsx"
import { ContactsList } from "#/app/components/runner/sections/contacts/viewer/contactsList.tsx"
import { getContactBpCost } from "#/rules/buildPoints/contactsBuilderUtils.ts"
import { useContactsAlerts } from "#/state/builder/alerts/useContactsAlerts.ts"
import { BuilderSectionId } from "#/state/builder/builderSectionId.ts"
import { ContactsSelectors } from "#/state/runner/contacts/contacts.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

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
