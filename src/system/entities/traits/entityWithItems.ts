import { z } from "zod"

import type { UUID } from "#/lib/uuidUtils.ts"

/**
 * The `{ parentId, childIds }` attachment position of an item within the parent/child gear
 * hierarchy. Implemented by `ItemData` (real values) and `RunnerData` (always a degenerate
 * `{ parentId: null, childIds: [] }` — Runner is never a child and never attaches to anything
 * itself). See CONTEXT.md's **Attachment** entry.
 */
export interface EntityWithItems {
  items: {
    parentId: UUID | null
    childIds: UUID[]
  }
}

export const EntityWithItemsSchmea = z.object({
  items: z.object({
    parentId: z.uuid().nullable(),
    childIds: z.uuid().array(),
  }),
}) satisfies z.ZodType<EntityWithItems>

export const isEntityWithItems = (obj: object): obj is EntityWithItems => {
  return EntityWithItemsSchmea.safeParse(obj).success
}
