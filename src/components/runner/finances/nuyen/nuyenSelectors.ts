import type { NuyenState } from "./nuyenStore.ts"

export const selectNuyenAmount = (state: NuyenState) => state.current
export const selectLoans = (state: NuyenState) => state.loans
