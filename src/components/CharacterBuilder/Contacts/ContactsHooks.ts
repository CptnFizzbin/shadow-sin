import { getContactBpCost } from "#/components/Character/Form/Contacts/ContactsUtils.ts"
import { useBuilderStoreSlice } from "#/components/CharacterBuilder/BuilderState/BuilderStateProvider.tsx"

export const useContactsSlice = () => {
  return useBuilderStoreSlice(
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
