import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { getContactBpCost } from "#/components/CharacterBuilder/Sections/Contacts/ContactsUtils.ts"

export const useContactsBuildPoints = () => {
  const contacts = useCharacterBuilderStore((state) => state.contacts)
  return {
    label: "Contacts",
    spent: contacts
      .map((contact) => getContactBpCost(contact))
      .reduce((total, cost) => total + cost, 0),
  }
}
