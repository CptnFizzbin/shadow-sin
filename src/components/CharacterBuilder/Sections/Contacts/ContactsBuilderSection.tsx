import type { FC } from "react"

import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"
import { ContactsList } from "#/components/CharacterBuilder/Sections/Contacts/ContactsList.tsx"
import { useContactsAlerts } from "#/components/CharacterBuilder/Sections/Contacts/UseContactsAlerts.ts"

export const ContactsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.contacts} alerts={useContactsAlerts()}>
      <ContactsList />
    </BuilderSection>
  )
}
