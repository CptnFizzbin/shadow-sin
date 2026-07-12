import type { UUID } from "node:crypto"

import { produce } from "immer"

import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import { addContact, removeContact, updateContact } from "#/stores/runner/contacts/contactsSlice.actions.ts"
import { contactsReducer } from "#/stores/runner/contacts/contactsSlice.ts"
import type { ContactData } from "#/system/contactData.ts"

export class ContactsStore extends StoreSlice<ContactData[]> {
  /** @deprecated Dispatch `addContact`/`updateContact` from `#/stores/runner/contacts/contactsSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  save(contact: ContactData) {
    if (!contact.id || contact.id === NullUuid) {
      return this.add(contact)
    }

    this.update(contact.id, () => contact)
    return contact
  }

  /** @deprecated Dispatch `addContact` from `#/stores/runner/contacts/contactsSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  add(contact: ContactData) {
    const action = addContact(contact)
    this.set((prev) => contactsReducer(prev, action))
    return action.payload
  }

  /** @deprecated Dispatch `updateContact` from `#/stores/runner/contacts/contactsSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  update(contactId: UUID, recipe: (prev: ContactData) => ContactData) {
    this.set((prev) => {
      const current = prev.find((c) => c.id === contactId)
      if (!current) return prev
      const updated = produce(current, recipe)
      return contactsReducer(prev, updateContact(updated))
    })
  }

  /** @deprecated Dispatch `removeContact` from `#/stores/runner/contacts/contactsSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  remove(contact: ContactData) {
    this.set((prev) => contactsReducer(prev, removeContact(contact.id)))
  }
}
