import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { getContactBpCost } from "#/components/CharacterBuilder/Contacts/ContactsUtils.ts"

export const useContactsBuildPoints = () => {
  const contacts = useCharacterBuilderStore((state) => state.contacts)

  const spent = contacts
    .map((contact) => getContactBpCost(contact))
    .reduce((total, cost) => total + cost, 0)

  return {
    label: "Contacts",
    spent,
  }
}
