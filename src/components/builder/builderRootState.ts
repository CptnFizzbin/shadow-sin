import type { RunnerData } from "#/system/runnerData.ts"

import type { BuilderState } from "./builderState.ts"

export interface BuilderRootState {
  runner: RunnerData
  builder: BuilderState
}
