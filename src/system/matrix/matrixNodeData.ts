import { z } from "zod"

import { AttributeKey } from "#/system/attributeKey.ts"
import type { EntityData } from "#/system/entityData.ts"
import { EntityKind } from "#/system/entityKind.ts"
import { GameEffectDataSchema } from "#/system/gameEffects/gameEffectData.ts"
import { SourceDataSchema } from "#/system/sourceData.ts"

import { NodeType } from "./nodeType.ts"

/**
 * A hackable system in the Matrix — a corp server, security system, or other host a Runner can
 * connect to and gain an account on. See CONTEXT.md's **MatrixNode** glossary entry.
 *
 * `matrix` is always fully specced (never derived from a Rating) — a `MatrixNode`'s entire
 * purpose is being a Matrix presence, so it carries no separate `rating` fallback.
 */
export interface MatrixNodeData extends EntityData {
  kind: EntityKind.matrixNode
  matrix: Partial<Record<AttributeKey, number>>
  nodeType: NodeType
}

export const MatrixNodeDataSchema = z.object({
  kind: z.literal(EntityKind.matrixNode),
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  matrix: z.partialRecord(z.nativeEnum(AttributeKey), z.number()),
  nodeType: z.nativeEnum(NodeType),
  description: z.string().optional(),
  source: SourceDataSchema.optional(),
  effects: z.array(GameEffectDataSchema).optional(),
}) satisfies z.ZodType<MatrixNodeData>
