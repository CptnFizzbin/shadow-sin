import type { NuyenState } from "#/components/character/finances/nuyen/nuyenStore.ts"

export const selectNuyenAmount = (state: NuyenState) => state.current
export const selectLoans = (state: NuyenState) => state.loans
