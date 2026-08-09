import type { BuilderState } from "#/components/builder/builderState.ts"
import type { CompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export interface RootState {
  runnerData: RunnerData
  builder: BuilderState
}

export type RootStore = CompatStore<RootState>
