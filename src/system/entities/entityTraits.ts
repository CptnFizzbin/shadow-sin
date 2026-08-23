import type { EntityData } from "#/system/entityData.ts"

export * from "./traits/entityWithAttrs.ts"
export * from "./traits/entityWithDamage.ts"
export type * from "./traits/entityWithItems.ts"
export * from "./traits/entityWithQualities.ts"

/** Alias of {@link EntityData}, used to bound a selector's `TState` against "some Entity" without
 *  requiring the full `RunnerData` shape. */
export type EntityBase = EntityData
