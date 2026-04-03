import type { UUID } from "node:crypto"

import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/character-sheet-provider.tsx"
import { createSliceAtom } from "#/integrations/tanstack-store/atom-utils.ts"
import { StoreSlice } from "#/integrations/tanstack-store/store-slice.ts"
import type { ContactData } from "#/lib/system/contact-data.ts"
import { NullUuid } from "#/lib/uuid-utils.ts"

export class ContactsStore extends StoreSlice<ContactData[]> {
  save(contact: ContactData) {
    console.log("Contact store save", contact)
    if (!contact.id || contact.id === NullUuid) {
      this.add(contact)
    } else {
      this.update(contact.id, () => contact)
    }
  }

  add(contact: ContactData) {
    this.set((prev) => [...prev, { ...contact, id: crypto.randomUUID() }])
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
