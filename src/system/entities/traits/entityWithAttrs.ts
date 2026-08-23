import { z } from "zod"

import { AttributeKey } from "#/system/attributeKey.ts"

/** An Entity with attribute ratings. Implemented by `RunnerData`; consumed by `AttrSelectors`
 *  (`attributesSlice.selectors.ts`). Deliberately standalone rather than `extends EntityData` —
 *  not every Entity kind a capability trait like this could apply to (e.g. Spirit/Sprite, which
 *  have no `source` field and don't use `EntityData.rating`) structurally satisfies
 *  `EntityData`'s full shape. See `EntityProvider`'s doc comment for the same call. */
export interface EntityWithAttrs {
  attributes: Partial<Record<AttributeKey, number>>
}

export const EntityWithAttrsSchmea = z.object({
  attributes: z.partialRecord(z.enum(AttributeKey), z.number()),
}) satisfies z.ZodType<EntityWithAttrs>

export const isEntityWithAttrs = (obj: object): obj is EntityWithAttrs => {
  return EntityWithAttrsSchmea.safeParse(obj).success
}
