import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import { getContactBpCost } from "#/components/characterBuilder/sections/contacts/contactsBuilderUtils.ts"

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
