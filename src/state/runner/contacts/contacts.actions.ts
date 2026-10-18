import { createAction } from "@reduxjs/toolkit"

import type { ContactData } from "#/system/model/contacts/contactData.ts"

export const addContact = createAction("contacts/add", (contact: ContactData) => {
  return { payload: { ...contact, id: crypto.randomUUID() } }
})

export const updateContact = createAction<ContactData>("contacts/update")
export const removeContact = createAction<string>("contacts/remove")

/** Adds each contact, replacing any existing contact that shares its `id`. */
export const mergeContacts = createAction<ContactData[]>("contacts/merge")
