/**
 * A Program or Agent **Running** on a Known Node — see CONTEXT.md's **Running** glossary
 * entry. `(sourceId, nodeId)` is a unique pair within `MatrixGameState.activePrograms`:
 * the same source can run on several different Nodes at once, but not twice on the same Node.
 */
export interface ActiveProgram {
  /** Id of the owned Program (or, later, Agent) `Item` this is a running copy of. */
  sourceId: string
  /** Id of the `KnownNode` hosting this running copy. */
  nodeId: string
}
