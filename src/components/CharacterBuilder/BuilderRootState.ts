import type { BuilderState } from "#/components/CharacterBuilder/BuilderState.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export interface BuilderRootState {
  character: CharacterSheet
  builder: BuilderState
}
