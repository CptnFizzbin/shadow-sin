import {
  useBuilderStoreSlice,
  useBuildStateStore,
} from "#/components/CharacterBuilder/BuilderState/BuilderStateProvider.tsx"
import type { ContactData } from "#/lib/system/types/contactData.ts"

export function contactBuildPoints(contacts: ContactData[]): number {
  return contacts.reduce(
    (total, contact) => total + contact.connection + contact.loyalty,
    0,
  )
}

export function useContactsFormGroup() {
  const contactsSlice = useBuilderStoreSlice(
    (state) => state.contacts,
    (state, contacts) => {
      state.contacts = contacts
      return state
    },
  )
  const contacts = useBuildStateStore((state) => state.contacts)

  const bpSpent = contactBuildPoints(contacts)

  const addContact = (contact: ContactData) => {
    contactsSlice.update((draft) => {
      draft.push(contact)
    })
  }

  const updateContact = (contact: ContactData) => {
    contactsSlice.update((draft) => {
      const index = draft.findIndex((c) => c.id === contact.id)
      if (index !== -1) draft[index] = contact
    })
  }

  const removeContact = (contact: ContactData) => {
    contactsSlice.update((draft) => {
      const index = draft.findIndex((c) => c.id === contact.id)
      if (index !== -1) draft.splice(index, 1)
    })
  }

  return {
    contacts,
    bpSpent,
    addContact,
    updateContact,
    removeContact,
  }
}
