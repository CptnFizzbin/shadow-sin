import { z } from "zod"

import { AttributeKey } from "#/system/attributeKey.ts"

/** An Entity with attribute ratings. Implemented by `RunnerData`; consumed by `AttrSelectors`
 *  (`attributesSlice.selectors.ts`). */
export interface EntityWithAttrs {
  attributes: Partial<Record<AttributeKey, number>>
}

export const EntityWithAttrsSchmea = z.object({
  attributes: z.partialRecord(z.enum(AttributeKey), z.number()),
}) satisfies z.ZodType<EntityWithAttrs>

export const isEntityWithAttrs = (obj: object): obj is EntityWithAttrs => {
  return EntityWithAttrsSchmea.safeParse(obj).success
}
