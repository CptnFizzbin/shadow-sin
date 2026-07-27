import type { SpiritData } from "#/system/magic/spiritData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectSpirits(state: RunnerData): SpiritData[] {
  return state.spirits
}
