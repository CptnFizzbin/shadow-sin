import type { BuilderState } from "#/components/characterBuilder/builderState.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export interface BuilderRootState {
  character: CharacterSheet
  builder: BuilderState
}
