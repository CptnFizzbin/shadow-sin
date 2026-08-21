/**
 * Preview stub of 0015 Slice 5's `EntityWithItems` shape
 * (`docs/features/0015-entity-interface-decomposition.md`'s Rough Interface Sketch). Not yet
 * implemented by any real type — `ItemData` still stores `parentId`/`childIds` directly, and
 * `RunnerData` still stores its item collection as `gear`, not `_data_.items`. That migration is
 * 0015 Slice 5's job (tracked in issue #534), not this pass's.
 *
 * Exists now only so `ItemSelectors` (`gearSlice.selectors.ts`) can be positioned to bound its
 * `TState` against this capability interface once Slice 5 lands, per
 * `docs/adr/0014-selector-input-decomposition.md` — nothing in this codebase implements it yet.
 */
export interface EntityWithItems {
  items: {
    parentId: string | null
    childIds: string[]
  }
}
