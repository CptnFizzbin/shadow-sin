import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"

const initialState: ComplexFormData[] = []

export const complexFormsSlice = createSlice({
  name: "complexForms",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<ComplexFormData>) => {
      state.push(action.payload)
    },
    update: (state, action: PayloadAction<ComplexFormData>) => {
      const index = state.findIndex((f) => f.id === action.payload.id)
      if (index !== -1) state[index] = action.payload
    },
    remove: (state, action: PayloadAction<string>) => {
      return state.filter((f) => f.id !== action.payload)
    },
    save: {
      prepare: (form: ComplexFormData) => {
        if (!form.id || form.id === NullUuid) {
          return { payload: { ...form, id: crypto.randomUUID() } }
        }
        return { payload: form }
      },
      reducer: (state, action: PayloadAction<ComplexFormData>) => {
        const index = state.findIndex((f) => f.id === action.payload.id)
        if (index === -1) state.push(action.payload)
        else state[index] = action.payload
      },
    },
  },
})

export const {
  add: addComplexForm,
  update: updateComplexForm,
  remove: removeComplexForm,
  save: saveComplexForm,
} = complexFormsSlice.actions
