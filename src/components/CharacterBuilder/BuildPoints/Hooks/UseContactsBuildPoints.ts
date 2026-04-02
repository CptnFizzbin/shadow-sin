import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"
import { getContactBpCost } from "#/components/Contacts/ContactsUtils.ts"

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
