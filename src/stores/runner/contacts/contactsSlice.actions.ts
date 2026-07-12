import { createAction } from "@reduxjs/toolkit"

import type { ContactData } from "#/system/contactData.ts"

export const addContact = createAction("contacts/add", (contact: ContactData) => {
  return { payload: { ...contact, id: crypto.randomUUID() } }
})

export const updateContact = createAction<ContactData>("contacts/update")
export const removeContact = createAction<string>("contacts/remove")
