import { AttributeKey } from "#/system/attributeKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectEdgeMax(state: RunnerData): number {
  return state.attributes[AttributeKey.edge]
}

export function selectEdgeCurrent(state: RunnerData): number {
  return state.edge.current
}
