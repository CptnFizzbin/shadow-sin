import { selectCurrentKarma, selectTotalKarma } from "#/lib/stores/runner/karma/karmaSlice.selectors.ts"

export const karmaCatalog = {
  current: selectCurrentKarma,
  total: selectTotalKarma,
}
