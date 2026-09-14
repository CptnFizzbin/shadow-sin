import { z } from "zod"

import { AccessLevel } from "./accessLevel.ts"
import type { MatrixNodeData } from "./matrixNodeData.ts"
import { MatrixNodeDataSchema } from "./matrixNodeData.ts"

/**
 * A `MatrixNode` the Runner currently has some access to — see CONTEXT.md's **Known Node**
 * glossary entry. Lives only inside `MatrixGameState.knownNodes`; there is no separate
 * "subscribed nodes" list — every Known Node other than the Active Node is one.
 */
export type KnownNode = MatrixNodeData & { accessLevel: AccessLevel }

export const KnownNodeSchema = MatrixNodeDataSchema.extend({
  accessLevel: z.nativeEnum(AccessLevel),
}) satisfies z.ZodType<KnownNode>
