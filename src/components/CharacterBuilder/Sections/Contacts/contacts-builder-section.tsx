import type { FC } from "react"

import { ContactsList } from "#/components/CharacterBuilder/Sections/Contacts/contacts-list.tsx"
import { useContactsAlerts } from "#/components/CharacterBuilder/Sections/Contacts/use-contacts-alerts.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/builder-section.tsx"

export const ContactsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.contacts} alerts={useContactsAlerts()}>
      <ContactsList />
    </BuilderSection>
  )
}
