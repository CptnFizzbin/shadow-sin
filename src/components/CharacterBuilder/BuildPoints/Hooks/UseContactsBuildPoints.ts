import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import { getContactBpCost } from "#/components/Contacts/ContactsUtils.ts"

export const useContactsBuildPoints = () => {
  const contacts = useCharacterSheet((state) => state.contacts)
  return {
    label: "Contacts",
    spent: contacts
      .map((contact) => getContactBpCost(contact))
      .reduce((total, cost) => total + cost, 0),
  }
}
