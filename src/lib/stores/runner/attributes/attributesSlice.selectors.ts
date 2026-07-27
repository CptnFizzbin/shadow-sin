import type { AttributeKey } from "#/system/attributeKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectAttributes(state: RunnerData): RunnerData["attributes"] {
  return state.attributes
}

export function selectAttribute(key: AttributeKey) {
  return (state: RunnerData): number => state.attributes[key]
}
