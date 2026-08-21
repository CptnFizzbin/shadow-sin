import type { AttributeKey } from "#/system/attributeKey.ts"

/**
 * Preview stub of 0015's `EntityWithAttrs` shape
 * (`docs/features/0015-entity-interface-decomposition.md`'s Rough Interface Sketch). Not yet
 * implemented by any real type — attribute access today is per-domain (`RunnerData.attributes`,
 * `attributesSlice.selectors.ts`), not a shared bag every Entity kind implements. That
 * generalization is 0015's job (Slices 2/3), not this pass's.
 *
 * Exists now only so `AttrSelectors` (`attributesSlice.selectors.ts`) can be positioned to bound
 * its `TState` against this capability interface once those slices land, per
 * `docs/adr/0014-selector-input-decomposition.md` — nothing in this codebase implements it yet.
 */
export interface EntityWithAttrs {
  attributes: Partial<Record<AttributeKey, number>>
}
