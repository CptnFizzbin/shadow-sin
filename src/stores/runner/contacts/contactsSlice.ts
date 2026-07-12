import { createReducer } from "@reduxjs/toolkit"

import type { ContactData } from "#/system/contactData.ts"

import { addContact, removeContact, updateContact } from "./contactsSlice.actions.ts"

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
    .addCase(removeContact, (state, action) => {
      return state.filter((c) => c.id !== action.payload)
    })
})
