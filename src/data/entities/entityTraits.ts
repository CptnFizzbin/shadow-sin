import type { EntityData } from "./entityData.ts"

export * from "#data/entities/traits/credential.ts"
export * from "#data/entities/traits/entityWithAttrs.ts"
export * from "#data/entities/traits/entityWithDamage.ts"
export * from "#data/entities/traits/entityWithItems.ts"
export * from "#data/entities/traits/entityWithQualities.ts"

/** Alias of {@link EntityData}, used to bound a selector's `TState` against "some Entity" without
 *  requiring the full `RunnerData` shape. */
export type EntityBase = EntityData
