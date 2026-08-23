import { z } from "zod"

import type { UUID } from "#/lib/uuidUtils.ts"

/**
 * The `{ parentId, childIds }` attachment position of an item within the parent/child gear
 * hierarchy. Implemented by `ItemData` (real values) and `RunnerData` (always a degenerate
 * `{ parentId: null, childIds: [] }` — Runner is never a child and never attaches to anything
 * itself). See CONTEXT.md's **Attachment** entry. Deliberately standalone rather than
 * `extends EntityBase` — not every Entity kind a capability trait like this could apply to (e.g.
 * Spirit/Sprite, which have no `source` field and don't use `EntityBase.rating`) structurally
 * satisfies `EntityBase`'s full shape. See `EntityProvider`'s doc comment for the same call.
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