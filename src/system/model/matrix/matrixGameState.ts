import type { ActiveProgram } from "./activeProgram.ts"
import type { KnownNode } from "./knownNode.ts"

/**
 * Player-facing Matrix session-management state — see CONTEXT.md's **Matrix Game State**
 * glossary entry. Every other Known Node besides the Active Node is informally a "subscription";
 * nothing marks them separately.
 */
export interface MatrixGameState {
  knownNodes: KnownNode[]
  /** Id of the Known Node the Runner is presently working in. Absent when no Node is active. */
  activeNodeId?: string
  activePrograms: ActiveProgram[]
}
