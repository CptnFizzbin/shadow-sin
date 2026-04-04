import type { BuilderState } from "#/components/CharacterBuilder/builder-state.ts"
import type { CharacterSheet } from "#/lib/system/character-sheet.ts"

export interface BuilderRootState {
  character: CharacterSheet
  builder: BuilderState
}
