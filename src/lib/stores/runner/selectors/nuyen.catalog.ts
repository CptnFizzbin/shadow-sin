import { selectLoans, selectNuyenAmount } from "#/lib/stores/runner/nuyen/nuyenSlice.selectors.ts"

export const nuyenCatalog = {
  current: selectNuyenAmount,
  loans: selectLoans,
}
