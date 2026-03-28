import type { FC } from "react"

import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import { ContactsList } from "#/components/CharacterBuilder/Sections/Contacts/ContactsList.tsx"
import { useContactsAlerts } from "#/components/CharacterBuilder/Sections/Contacts/UseContactsAlerts.ts"

export const ContactsBuilderSection: FC = () => {
  return (
    <BuilderSection title="Contacts" alerts={useContactsAlerts()}>
      <ContactsList />
    </BuilderSection>
  )
}
