import type { UUID } from "node:crypto"

import { createAction } from "@reduxjs/toolkit"

import { NullUuid } from "#/lib/uuidUtils.ts"
import type { LoanData } from "#/system/loanData.ts"

export const setNuyenAmount = createAction<number>("nuyen/setAmount")
export const depositNuyen = createAction<number>("nuyen/deposit")
export const withdrawNuyen = createAction<number>("nuyen/withdraw")

export const addLoan = createAction("nuyen/addLoan", (loan: Omit<LoanData, "id">) => {
  return { payload: { ...loan, id: crypto.randomUUID() as UUID } }
})

export const updateLoan = createAction<LoanData>("nuyen/updateLoan")
export const removeLoan = createAction<UUID>("nuyen/removeLoan")
export const payoffLoan = createAction<UUID>("nuyen/payoffLoan")
export const applyInterestToLoan = createAction<UUID>("nuyen/applyInterestToLoan")
export const nuyenEndOfMonth = createAction("nuyen/endOfMonth")

/** Lets a caller decide whether to dispatch `addLoan` or `updateLoan` for a save. */
export function isNewLoan(loan: LoanData): boolean {
  return !loan.id || loan.id === NullUuid
}
