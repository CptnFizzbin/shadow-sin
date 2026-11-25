import type { KnownNode } from "#/data/matrix/knownNode.ts"
import type { RunnerData } from "#/data/runner/runnerData.ts"
import type { Selector } from "#/state/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/state/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"

export namespace MatrixSelectors {
  export const selectKnownNodes = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.gameState.matrix.knownNodes,
  )

  export const selectActiveNodeId = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.gameState.matrix.activeNodeId,
  )

  export const selectActiveNode: Selector<{ runner: RunnerData }, KnownNode | undefined> = createMemoizedSelector(
    selectKnownNodes,
    selectActiveNodeId,
    (knownNodes, activeNodeId) => knownNodes.find((node) => node.id === activeNodeId),
  )

  export const selectActivePrograms = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.gameState.matrix.activePrograms,
  )
}
