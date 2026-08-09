/**
 * Determines a `MatrixNode`'s Processor Limit formula and nothing else — no other mechanical
 * difference between `general` and `nexus` (see CONTEXT.md's **Node Type** glossary entry).
 */
export enum NodeType {
  general = "general",
  nexus = "nexus",
}

export const NodeTypeLabels: Record<NodeType, string> = {
  [NodeType.general]: "General",
  [NodeType.nexus]: "Nexus",
}
