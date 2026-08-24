import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { mapToLegacySelector } from "#/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import type { ActiveProgram } from "#/system/matrix/activeProgram.ts"
import type { KnownNode } from "#/system/matrix/knownNode.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `MatrixSelectors.selectKnownNodes` via `useRunnerSelector` instead. */
export function selectKnownNodes(runner: RunnerData): KnownNode[] {
  return mapToLegacySelector(runner, MatrixSelectors.selectKnownNodes)
}

/** @deprecated Use `MatrixSelectors.selectActiveNodeId` via `useRunnerSelector` instead. */
export function selectActiveNodeId(runner: RunnerData): string | undefined {
  return mapToLegacySelector(runner, MatrixSelectors.selectActiveNodeId)
}

/** @deprecated Use `MatrixSelectors.selectActiveNode` via `useRunnerSelector` instead. */
export function selectActiveNode(runner: RunnerData): KnownNode | undefined {
  return mapToLegacySelector(runner, MatrixSelectors.selectActiveNode)
}

/** @deprecated Use `MatrixSelectors.selectActivePrograms` via `useRunnerSelector` instead. */
export function selectActivePrograms(runner: RunnerData): ActiveProgram[] {
  return mapToLegacySelector(runner, MatrixSelectors.selectActivePrograms)
}

export namespace MatrixSelectors {
  export const selectKnownNodes = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.gameState.matrix.knownNodes,
  )

  export const selectActiveNodeId = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.gameState.matrix.activeNodeId,
  )

  export const selectActiveNode = createMemoizedSelector(
    selectKnownNodes,
    selectActiveNodeId,
    (knownNodes, activeNodeId) => knownNodes.find((node) => node.id === activeNodeId),
  )

  export const selectActivePrograms = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.gameState.matrix.activePrograms,
  )
}
