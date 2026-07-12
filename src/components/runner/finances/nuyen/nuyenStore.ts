import type { UUID } from "node:crypto"

import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import {
  addLoan,
  applyInterestToLoan,
  depositNuyen,
  isNewLoan,
  nuyenEndOfMonth,
  payoffLoan,
  removeLoan,
  setNuyenAmount,
  updateLoan,
  withdrawNuyen,
} from "#/stores/runner/nuyen/nuyenSlice.actions.ts"
import { nuyenReducer } from "#/stores/runner/nuyen/nuyenSlice.ts"
import type { LoanData } from "#/system/loanData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export type NuyenState = RunnerData["nuyen"]

export class NuyenStore extends StoreSlice<NuyenState> {
  /** @deprecated Dispatch `setNuyenAmount` from `#/stores/runner/nuyen/nuyenSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  setAmount(amount: number) {
    this.set((prev) => nuyenReducer(prev, setNuyenAmount(amount)))
  }

  /** @deprecated Dispatch `depositNuyen` from `#/stores/runner/nuyen/nuyenSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  deposit(amount: number) {
    this.set((prev) => nuyenReducer(prev, depositNuyen(amount)))
  }

  /** @deprecated Dispatch `withdrawNuyen` from `#/stores/runner/nuyen/nuyenSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  withdraw(amount: number) {
    this.set((prev) => nuyenReducer(prev, withdrawNuyen(amount)))
  }

  /** @deprecated Dispatch `addLoan` from `#/stores/runner/nuyen/nuyenSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  addLoan(loan: Omit<LoanData, "id">): LoanData {
    const action = addLoan(loan)
    this.set((prev) => nuyenReducer(prev, action))
    return action.payload
  }

  /** @deprecated Dispatch `addLoan`/`updateLoan` from `#/stores/runner/nuyen/nuyenSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  saveLoan(loan: LoanData): LoanData {
    if (isNewLoan(loan)) return this.addLoan(loan)
    this.set((prev) => nuyenReducer(prev, updateLoan(loan)))
    return loan
  }

  /** @deprecated Dispatch `removeLoan` from `#/stores/runner/nuyen/nuyenSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  removeLoan(loanId: UUID) {
    this.set((prev) => nuyenReducer(prev, removeLoan(loanId)))
  }

  /** @deprecated Dispatch `payoffLoan` from `#/stores/runner/nuyen/nuyenSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  payoffLoan(loanId: UUID) {
    this.set((prev) => nuyenReducer(prev, payoffLoan(loanId)))
  }

  /** @deprecated Dispatch `applyInterestToLoan` from `#/stores/runner/nuyen/nuyenSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  applyInterestToLoan(loanId: UUID) {
    this.set((prev) => nuyenReducer(prev, applyInterestToLoan(loanId)))
  }

  /** @deprecated Dispatch `nuyenEndOfMonth` from `#/stores/runner/nuyen/nuyenSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  endOfMonth() {
    this.set((prev) => nuyenReducer(prev, nuyenEndOfMonth()))
  }
}
