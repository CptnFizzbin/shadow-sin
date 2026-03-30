import type { UUID } from "node:crypto"

import type { BaseAtom } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetContext.tsx"
import type { ContactData } from "#/lib/system/contactData.ts"

export interface ContactsStore extends BaseAtom<ContactData[]> {
  add(contact: ContactData): void

  update(contactId: UUID, recipe: (prev: ContactData) => ContactData): void

  remove(contact: ContactData): void
}

export function contactBuildPoints(contacts: ContactData[]): number {
  return contacts.reduce(
    (total, contact) => total + contact.connection + contact.loyalty,
    0,
  )
}

export function useContactsStore() {
  const store = useCharacterSheetContext()

  return useMemo((): ContactsStore => {
    const contactsStore = createStore(() => store.state.contacts)

    return {
      get: () => contactsStore.get(),
      subscribe: (listener) => contactsStore.subscribe(listener),

      add(contact: ContactData) {
        store.setState(produce((draft) => {
          draft.contacts.push({ ...contact, id: crypto.randomUUID() })
        }))
      },

      update(contactId, recipe) {
        store.setState(produce((draft) => {
          draft.contacts = draft.contacts.map((contact) => {
            if (contact.id === contactId) return produce(contact, recipe)
            return contact
          })
        }))
      },

      remove(contact: ContactData) {
        store.setState(produce((draft) => {
          draft.contacts = draft.contacts.filter((c) => c.id !== contact.id)
        }))
      },
    }
  }, [store])
}
