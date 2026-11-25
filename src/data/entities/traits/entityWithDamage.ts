import { z } from "zod"

/** An Entity with a damage track per `DamageTrackKey`. Implemented by `RunnerData`; consumed by
 *  `DamageSelectors` (`damageSlice.selectors.ts`). */
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
