import type { BuilderState } from "#/components/builder/builderState.ts"

export function selectStartingNuyen(state: BuilderState): number | undefined {
  return state.startingNuyen
}
