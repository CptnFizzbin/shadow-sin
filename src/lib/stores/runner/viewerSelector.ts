import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createSelector } from "#/integrations/reselect/selectorUtils.ts"
import type { EntityBase } from "#/system/entities/entityTraits.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

const selectEntity = createSelector<{ entity: EntityBase }, EntityBase>((state) => state.entity)

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
       *  selector whose `TState` only needs that trait rather than the full `EntityBase`. */
      withTrait<TEntityTrait>() {
        // state.entity is read identically regardless of TEntityTrait, so this only widens the
        // return type for the caller — TypeScript can't verify that structurally, hence the cast.
        // eslint-disable-next-line no-restricted-syntax
        return selectEntity as unknown as Selector<{ entity: TEntityTrait }, TEntityTrait>
      },
    },
  ),
  selectItems: createSelector<{ items: ItemCatalog }, ItemCatalog>((state) => state.items),
}
