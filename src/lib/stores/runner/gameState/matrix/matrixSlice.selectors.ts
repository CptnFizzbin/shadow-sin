import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { ActiveProgram } from "#/system/matrix/activeProgram.ts"
import type { KnownNode } from "#/system/matrix/knownNode.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `MatrixSelectors.selectKnownNodes` via `useRunnerSelector` instead. */
export function selectKnownNodes(state: RunnerData): KnownNode[] {
  return state.gameState.matrix.knownNodes
}

/** @deprecated Use `MatrixSelectors.selectActiveNodeId` via `useRunnerSelector` instead. */
export function selectActiveNodeId(state: RunnerData): string | undefined {
  return state.gameState.matrix.activeNodeId
}

/** @deprecated Use `MatrixSelectors.selectActiveNode` via `useRunnerSelector` instead. */
export function selectActiveNode(state: RunnerData): KnownNode | undefined {
  const { knownNodes, activeNodeId } = state.gameState.matrix
  return knownNodes.find((node) => node.id === activeNodeId)
}

/** @deprecated Use `MatrixSelectors.selectActivePrograms` via `useRunnerSelector` instead. */
export function selectActivePrograms(state: RunnerData): ActiveProgram[] {
  return state.gameState.matrix.activePrograms
}

const legacy = {
  selectKnownNodes,
  selectActiveNodeId,
  selectActiveNode,
  selectActivePrograms,
}

/** Standardized, namespaced selectors for the Matrix game-state domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace MatrixSelectors {
  export const selectKnownNodes: Selector<{ runner: RunnerData }, KnownNode[]> = (state) =>
    legacy.selectKnownNodes(state.runner)
  export const selectActiveNodeId: Selector<{ runner: RunnerData }, string | undefined> = (state) =>
    legacy.selectActiveNodeId(state.runner)
  export const selectActiveNode: Selector<{ runner: RunnerData }, KnownNode | undefined> = (state) =>
    legacy.selectActiveNode(state.runner)
  export const selectActivePrograms: Selector<{ runner: RunnerData }, ActiveProgram[]> = (state) =>
    legacy.selectActivePrograms(state.runner)
}
