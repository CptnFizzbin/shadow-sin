import { createSelector } from "#/integrations/reselect/selectorUtils.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

// Kept as `object` rather than `EntityBase` — not every Entity kind this can hold (starting with
// `RunnerData`, which keys its display name under `profile.name` rather than a top-level `name`)
// structurally satisfies `EntityBase`'s full shape. See `EntityProvider`'s doc comment for the
// same call; `withTrait` below narrows to whatever trait(s) a selector's `TState` actually needs.
const selectEntity = createSelector<{ entity: object }, object>((state) => state.entity)

/**
 * The building-block accessors every domain's namespaced selectors compose from: the bare
 * `{ runner }`, `{ entity }`, and `{ items }` state slices a `Selector<TState, ...>` names in its
 * `TState`. See docs/adr/0014-selector-input-decomposition.md.
 */
export const ViewerStateSelectors = {
  selectRunner: createSelector<{ runner: RunnerData }, RunnerData>((state) => state.runner),
  selectEntity: Object.assign(
    selectEntity,
    {
      /** `selectEntity` narrowed to a specific capability trait (e.g. `EntityWithAttrs`), for a
       *  selector whose `TState` only needs that trait rather than the full entity. Throws if the
       *  entity in scope doesn't actually carry the trait — every caller composes this into a
       *  selector graph that assumes the narrowed shape unconditionally (see `DamageSelectors`),
       *  so a mismatch is a data-integrity bug to surface loudly, not a `null` to thread through
       *  every combiner downstream. */
      withTrait<TEntityTrait extends object>(traitTestFn: (entity: object) => entity is TEntityTrait) {
        return createSelector<{ entity: object }, TEntityTrait>((state) => {
          const entity = selectEntity(state)
          if (!traitTestFn(entity)) {
            throw new Error("Entity in scope doesn't have the expected trait")
          }
          return entity
        })
      },
    },
  ),
  selectItems: createSelector<{ items: ItemCatalog }, ItemCatalog>((state) => state.items),
}
