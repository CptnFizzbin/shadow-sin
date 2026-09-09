import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import type { KnownNode } from "#/system/matrix/knownNode.ts"
import type { RunnerData } from "#/system/runnerData.ts"

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
