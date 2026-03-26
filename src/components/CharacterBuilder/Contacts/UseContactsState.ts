import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { ContactData } from "#/lib/system/contactData.ts"

export function contactBuildPoints(contacts: ContactData[]): number {
  return contacts.reduce(
    (total, contact) => total + contact.connection + contact.loyalty,
    0,
  )
}

export function useContactsState() {
  const contactsSlice = useCharacterBuilderStoreSlice(
    (state) => state.contacts,
    (state, contacts) => {
      state.contacts = contacts
      return state
    },
  )
  const contacts = useCharacterBuilderStore((state) => state.contacts)

  const bpSpent = contactBuildPoints(contacts)

  const addContact = (contact: ContactData) => {
    contactsSlice.update((prev) => {
      return [...prev, { ...contact, id: crypto.randomUUID() }]
    })
  }

  const updateContact = (contact: ContactData) => {
    contactsSlice.update((draft) => {
      return draft.map((c) => (c.id === contact.id ? contact : c))
    })
  }

  const removeContact = (contact: ContactData) => {
    contactsSlice.update((draft) => {
      return draft.filter((c) => c.id !== contact.id)
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
