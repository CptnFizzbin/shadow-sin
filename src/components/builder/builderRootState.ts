import type { BuilderState } from "#/components/builder/builderState.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

export interface BuilderRootState {
  character: CharacterSheet
  builder: BuilderState
}
