import type { ItemData } from "#/system/itemData.ts"
import { isAvailable, isEquipped, isStashed } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectGear(state: RunnerData): Record<string, ItemData> {
  return state.gear
}

export function selectAvailable(state: RunnerData): ItemData[] {
  return Object.values(state.gear).filter(isAvailable)
}

export function selectEquipped(state: RunnerData): ItemData[] {
  return Object.values(state.gear).filter(isEquipped)
}

export function selectStashed(state: RunnerData): ItemData[] {
  return Object.values(state.gear).filter(isStashed)
}
