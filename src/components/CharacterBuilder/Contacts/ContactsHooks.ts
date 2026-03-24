import { useCharacterBuilderStoreSlice } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { getContactBpCost } from "#/components/CharacterBuilder/Contacts/ContactsUtils.ts"

export const useContactsSlice = () => {
  return useCharacterBuilderStoreSlice(
    (state) => state.contacts,
    (state, contacts) => {
      state.contacts = contacts
      return state
    },
  )
}

export const useContactsBuildPoints = () => {
  const contacts = useContactsSlice()

  const spent = contacts.state
    .map((contact) => getContactBpCost(contact))
    .reduce((total, cost) => total + cost, 0)

  return {
    spent,
  }
}
