import type { QualityData } from "#/system/qualityData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectQualities(state: RunnerData): QualityData[] {
  return state.qualities
}
