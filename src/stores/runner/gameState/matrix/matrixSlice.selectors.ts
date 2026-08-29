import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"

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
