import type { EntityData } from "#/system/entityData.ts"

/**
 * Alias of {@link EntityData} under the `system/entities/traits/` home that
 * `docs/features/0015-entity-interface-decomposition.md` is consolidating capability interfaces
 * into. `EntityData` itself (Slice 1's `kind` discriminant already shipped, see
 * `docs/adr/0014-selector-input-decomposition.md`) stays put at `system/entityData.ts` — moving it
 * is 0015's job, not this pass's. This re-export exists only so new selectors can bound `TState`
 * against `entities/traits/*` consistently, without waiting on that move.
 */
export type EntityBase = EntityData
