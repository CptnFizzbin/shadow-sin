import type { UUID } from "node:crypto"

import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import { NullUuid } from "#/lib/uuidUtils.ts"
import type { LoanData } from "#/system/loanData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

const initialState: RunnerData["nuyen"] = {
  current: 0,
  loans: [],
}

export const nuyenSlice = createSlice({
  name: "nuyen",
  initialState,
  reducers: {
    setAmount: (state, action: PayloadAction<number>) => {
      state.current = action.payload
    },
    deposit: (state, action: PayloadAction<number>) => {
      state.current += action.payload
    },
    withdraw: (state, action: PayloadAction<number>) => {
      state.current -= action.payload
    },
    addLoan: {
      prepare: (loan: Omit<LoanData, "id">) => {
        return { payload: { ...loan, id: crypto.randomUUID() as UUID } }
      },
      reducer: (state, action: PayloadAction<LoanData>) => {
        state.loans.push(action.payload)
      },
    },
    updateLoan: (state, action: PayloadAction<LoanData>) => {
      const index = state.loans.findIndex((l) => l.id === action.payload.id)
      if (index >= 0) state.loans[index] = action.payload
    },
    removeLoan: (state, action: PayloadAction<UUID>) => {
      state.loans = state.loans.filter((l) => l.id !== action.payload)
    },
    payoffLoan: (state, action: PayloadAction<UUID>) => {
      const loan = state.loans.find((l) => l.id === action.payload)
      if (!loan) return
      state.current -= loan.amount
      state.loans = state.loans.filter((l) => l.id !== action.payload)
    },
    applyInterestToLoan: (state, action: PayloadAction<UUID>) => {
      const loan = state.loans.find((l) => l.id === action.payload)
      if (loan && loan.interestRate > 0) {
        loan.amount = Math.ceil(loan.amount * (1 + loan.interestRate / 100))
      }
    },
    endOfMonth: (state) => {
      for (const loan of state.loans) {
        if (loan.interestRate > 0) {
          loan.amount = Math.ceil(loan.amount * (1 + loan.interestRate / 100))
        }
      }
    },
  },
})

export const {
  setAmount: setNuyenAmount,
  deposit: depositNuyen,
  withdraw: withdrawNuyen,
  addLoan,
  updateLoan,
  removeLoan,
  payoffLoan,
  applyInterestToLoan,
  endOfMonth: nuyenEndOfMonth,
} = nuyenSlice.actions

/** Matches `NuyenStore.saveLoan`'s add-or-update dispatch. Not a reducer itself. */
export function isNewLoan(loan: LoanData): boolean {
  return !loan.id || loan.id === NullUuid
}
