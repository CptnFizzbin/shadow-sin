import type { ActiveProgram } from "./activeProgram.ts"
import type { KnownNode } from "./knownNode.ts"

/**
 * Player-facing Matrix session-management state: the Runner's Known Nodes, Active Node, and
 * what's Running on them — see CONTEXT.md's **Known Node** and **Active Node** glossary entries. Every other Known Node besides the Active Node is informally a "subscription";
 * nothing marks them separately.
 */
export interface MatrixGameState {
  knownNodes: KnownNode[]
  /** Id of the Known Node the Runner is presently working in. Absent when no Node is active. */
  activeNodeId?: string
  activePrograms: ActiveProgram[]
}
