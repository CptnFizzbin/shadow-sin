import type { CharacterSheet } from "#/system/characterSheet.ts"

import type { BuilderState } from "./builderState.ts"

export interface BuilderRootState {
  character: CharacterSheet
  builder: BuilderState
}
