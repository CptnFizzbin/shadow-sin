import type { UUID } from "#/lib/uuidUtils.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import type { EntityData } from "#/system/entityData.ts"
import type { QualityData } from "#/system/qualityData.ts"

/** Alias of {@link EntityData}, used to bound a selector's `TState` against "some Entity" without
 *  requiring the full `RunnerData` shape. */
export type EntityBase = EntityData

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

/** An Entity with a damage track per `DamageTrackKey`. Implemented by `RunnerData`; consumed by
 *  `DamageSelectors` (`damageSlice.selectors.ts`). */
export interface EntityWithDamage {
  damage: {
    [track: string]: number
  }
}

/** An Entity with attribute ratings. Implemented by `RunnerData`; consumed by `AttrSelectors`
 *  (`attributesSlice.selectors.ts`). */
export interface EntityWithAttrs {
  attributes: Partial<Record<AttributeKey, number>>
}

/** An Entity with a list of Qualities. Implemented by `RunnerData`; consumed by `DamageSelectors`
 *  for High/Low Pain Tolerance effects. */
export interface EntityWithQualities {
  qualities: QualityData[]
}
