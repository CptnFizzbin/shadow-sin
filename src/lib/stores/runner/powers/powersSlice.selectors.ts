import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectPowers(state: RunnerData): AdeptPowerData[] {
  return state.powers
}
