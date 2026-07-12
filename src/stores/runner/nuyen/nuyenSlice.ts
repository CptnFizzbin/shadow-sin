import { createReducer } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/runnerData.ts"

import {
  addLoan,
  applyInterestToLoan,
  depositNuyen,
  nuyenEndOfMonth,
  payoffLoan,
  removeLoan,
  setNuyenAmount,
  updateLoan,
  withdrawNuyen,
} from "./nuyenSlice.actions.ts"

const initialState: RunnerData["nuyen"] = {
  current: 0,
  loans: [],
}

export const nuyenReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setNuyenAmount, (state, action) => {
      state.current = action.payload
    })
    .addCase(depositNuyen, (state, action) => {
      state.current += action.payload
    })
    .addCase(withdrawNuyen, (state, action) => {
      state.current -= action.payload
    })
    .addCase(addLoan, (state, action) => {
      state.loans.push(action.payload)
    })
    .addCase(updateLoan, (state, action) => {
      const index = state.loans.findIndex((l) => l.id === action.payload.id)
      if (index >= 0) state.loans[index] = action.payload
    })
    .addCase(removeLoan, (state, action) => {
      state.loans = state.loans.filter((l) => l.id !== action.payload)
    })
    .addCase(payoffLoan, (state, action) => {
      const loan = state.loans.find((l) => l.id === action.payload)
      if (!loan) return
      state.current -= loan.amount
      state.loans = state.loans.filter((l) => l.id !== action.payload)
    })
    .addCase(applyInterestToLoan, (state, action) => {
      const loan = state.loans.find((l) => l.id === action.payload)
      if (loan && loan.interestRate > 0) {
        loan.amount = Math.ceil(loan.amount * (1 + loan.interestRate / 100))
      }
    })
    .addCase(nuyenEndOfMonth, (state) => {
      for (const loan of state.loans) {
        if (loan.interestRate > 0) {
          loan.amount = Math.ceil(loan.amount * (1 + loan.interestRate / 100))
        }
      }
    })
})
