import type { UUID } from "node:crypto"

import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import type { ContactData } from "#/lib/system/contactData.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

export class ContactsStore extends StoreSlice<ContactData[]> {
  save(contact: ContactData) {
    if (!contact.id || contact.id === NullUuid) {
      return this.add(contact)
    }

    this.update(contact.id, () => contact)
    return contact
  }

  add(contact: ContactData) {
    const persistedContact = { ...contact, id: crypto.randomUUID() }
    this.set((prev) => [...prev, persistedContact])
    return persistedContact
  }

  update(contactId: UUID, recipe: (prev: ContactData) => ContactData) {
    this.set((prev) => prev.map((contact) => contact.id === contactId ? produce(contact, recipe) : contact))
  }

  remove(contact: ContactData) {
    this.set((prev) => prev.filter((c) => c.id !== contact.id))
  }
}

export function useContactsStore() {
  const store = useCharacterSheetContext()

  return useMemo((): ContactsStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.contacts,
      (root, contacts) => produce(root, (draft) => { draft.contacts = contacts }),
    )

    return new ContactsStore(atom)
  }, [store])
}
