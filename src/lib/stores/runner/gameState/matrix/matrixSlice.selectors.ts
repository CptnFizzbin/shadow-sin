import type { ActiveProgram } from "#/system/matrix/activeProgram.ts"
import type { KnownNode } from "#/system/matrix/knownNode.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectKnownNodes(state: RunnerData): KnownNode[] {
  return state.gameState.matrix.knownNodes
}

export function selectActiveNodeId(state: RunnerData): string | undefined {
  return state.gameState.matrix.activeNodeId
}

export function selectActiveNode(state: RunnerData): KnownNode | undefined {
  const { knownNodes, activeNodeId } = state.gameState.matrix
  return knownNodes.find((node) => node.id === activeNodeId)
}

export function selectActivePrograms(state: RunnerData): ActiveProgram[] {
  return state.gameState.matrix.activePrograms
}
