import { createReducer } from "@reduxjs/toolkit"

import type { ComplexFormData } from "#/system/magic/complexFormData.ts"

import { addComplexForm, removeComplexForm, saveComplexForm, updateComplexForm } from "./complexFormsSlice.actions.ts"

const initialState: ComplexFormData[] = []

export const complexFormsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addComplexForm, (state, action) => {
      state.push(action.payload)
    })
    .addCase(updateComplexForm, (state, action) => {
      const index = state.findIndex((f) => f.id === action.payload.id)
      if (index !== -1) state[index] = action.payload
    })
    .addCase(removeComplexForm, (state, action) => {
      return state.filter((f) => f.id !== action.payload)
    })
    .addCase(saveComplexForm, (state, action) => {
      const index = state.findIndex((f) => f.id === action.payload.id)
      if (index === -1) state.push(action.payload)
      else state[index] = action.payload
    })
})
