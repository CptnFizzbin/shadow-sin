import { createReducer } from "@reduxjs/toolkit"

import type { ContactData } from "#/system/model/contacts/contactData.ts"

import { addContact, mergeContacts, removeContact, updateContact } from "./contacts.actions.ts"

const initialState: ContactData[] = []

export const contactsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addContact, (state, action) => {
      state.push(action.payload)
    })
    .addCase(updateContact, (state, action) => {
      const index = state.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) state[index] = action.payload
    })
    .addCase(mergeContacts, (state, action) => {
      for (const incoming of action.payload) {
        const index = state.findIndex((c) => c.id === incoming.id)
        if (index === -1) state.push(incoming)
        else state[index] = incoming
      }
    })
    .addCase(removeContact, (state, action) => {
      return state.filter((c) => c.id !== action.payload)
    })
})
