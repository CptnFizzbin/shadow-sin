import { useStore } from "@tanstack/react-store"
import { produce } from "immer"

import { useCharacterBuilderStoreContext } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { ContactData } from "#/lib/system/contactData.ts"

export function contactBuildPoints(contacts: ContactData[]): number {
  return contacts.reduce(
    (total, contact) => total + contact.connection + contact.loyalty,
    0,
  )
}

export function useBuilderContactsApi() {
  const store = useCharacterBuilderStoreContext()
  const contacts = useStore(store, (state) => state.contacts)
  const bpSpent = contactBuildPoints(contacts)

  return {
    contacts,
    bpSpent,

    addContact(contact: ContactData) {
      store.setState(produce((draft) => {
        draft.contacts.push({ ...contact, id: crypto.randomUUID() })
      }))
    },

    updateContact(contact: ContactData) {
      store.setState(produce((draft) => {
        draft.contacts = draft.contacts.map((c) =>
          c.id === contact.id ? contact : c,
        )
      }))
    },

    removeContact(contact: ContactData) {
      store.setState(produce((draft) => {
        draft.contacts = draft.contacts.filter((c) => c.id !== contact.id)
      }))
    },
  }
}
