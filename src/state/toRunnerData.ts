import type { RunnerData } from "#/system/model/runnerData.ts"

import type { AppState } from "./rootState.ts"

export const toRunnerData = (state: AppState): RunnerData => {
  const { runner, items } = state

  return {
    ...runner,
    _data_: {
      ...runner._data_,
      items: items,
    },
  }
}
