import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import { getContactBpCost } from "#/components/CharacterBuilder/Sections/Contacts/contacts-builder-utils.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"

export const useContactsBuildPoints = () => {
  const contacts = useCharacterSheet((state) => state.contacts)
  return {
    sectionId: BuilderSectionId.contacts,
    label: "Contacts",
    spent: contacts
      .map((contact) => getContactBpCost(contact))
      .reduce((total, cost) => total + cost, 0),
  }
}
