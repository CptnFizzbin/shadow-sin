import { z } from "zod"

/** An Entity with a damage track per `DamageTrackKey`. Implemented by `RunnerData`; consumed by
 *  `DamageSelectors` (`damageSlice.selectors.ts`). Deliberately standalone rather than
 *  `extends EntityData` — not every Entity kind a capability trait like this could apply to (e.g.
 *  Spirit/Sprite, which have no `source` field and don't use `EntityData.rating`) structurally
 *  satisfies `EntityData`'s full shape. See `EntityProvider`'s doc comment for the same call. */
export interface EntityWithDamage {
  damage: {
    [track: string]: number
  }
}

export const EntityWithDamageSchema = z.object({
  damage: z.record(z.string(), z.number()),
}) satisfies z.ZodType<EntityWithDamage>

export const isEntityWithDamage = (obj: object): obj is EntityWithDamage => {
  return EntityWithDamageSchema.safeParse(obj).success
}
