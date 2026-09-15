import type { RunnerData } from "#/system/model/runnerData.ts"

import type { RunnerState } from "./runnerState.ts"

export const toRunnerData = (state: RunnerState): RunnerData => {
  const { runner, items } = state

  return {
    ...runner,
    _data_: {
      ...runner._data_,
      items: items,
    },
  }
}
