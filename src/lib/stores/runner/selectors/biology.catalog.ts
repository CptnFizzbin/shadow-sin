import { selectAwakening, selectBiology } from "#/lib/stores/runner/biology/biologySlice.selectors.ts"

export const biologyCatalog = {
  all: selectBiology,
  awakening: selectAwakening,
}
