import type { RunnerData } from "#/system/runnerData.ts"

export function selectLastExportDate(state: RunnerData): RunnerData["_meta_"]["lastExportDate"] {
  return state._meta_.lastExportDate
}
