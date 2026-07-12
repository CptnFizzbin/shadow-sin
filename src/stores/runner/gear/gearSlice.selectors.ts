import type { ItemData } from "#/system/itemData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectGear(state: RunnerData): Record<string, ItemData> {
  return state.gear
}
