import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import type { ContactData } from "#/system/contactData.ts"

const initialState: ContactData[] = []

export const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    add: {
      prepare: (contact: ContactData) => {
        return { payload: { ...contact, id: crypto.randomUUID() } }
      },
      reducer: (state, action: PayloadAction<ContactData>) => {
        state.push(action.payload)
      },
    },
    update: (state, action: PayloadAction<ContactData>) => {
      const index = state.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) state[index] = action.payload
    },
    remove: (state, action: PayloadAction<string>) => {
      return state.filter((c) => c.id !== action.payload)
    },
  },
})

export const { add: addContact, update: updateContact, remove: removeContact } = contactsSlice.actions
