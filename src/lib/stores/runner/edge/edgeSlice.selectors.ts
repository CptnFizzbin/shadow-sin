import { selectAttrBase } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectEdgeMax(state: RunnerData): number {
  return selectAttrBase(AttributeKey.edge)(state)
}

export function selectEdgeCurrent(state: RunnerData): number {
  return state.edge.current
}
