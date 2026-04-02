import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { getContactBpCost } from "#/components/Contacts/contacts-utils.ts"

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
