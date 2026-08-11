import { selectSpells } from "#/lib/stores/runner/spells/spellsSlice.selectors.ts"

export const spellsCatalog = {
  all: selectSpells,
}
