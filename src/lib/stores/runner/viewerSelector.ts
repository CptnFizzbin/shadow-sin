import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createSelector } from "#/integrations/reselect/selectorUtils.ts"
import type { EntityBase } from "#/system/entities/entityTraits.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

const selectEntity = createSelector<{ entity: EntityBase }, EntityBase>((state) => state.entity)

export const ViewerStateSelectors = {
  selectRunner: createSelector<{ runner: RunnerData }, RunnerData>((state) => state.runner),
  selectEntity: Object.assign(
    selectEntity,
    {
      withTrait<TEntityTrait>() {
        // selectEntity is the same logic, just with a different entity trait
        // eslint-disable-next-line no-restricted-syntax
        return selectEntity as unknown as Selector<{ entity: TEntityTrait }, TEntityTrait>
      },
    },
  ),
  selectItems: createSelector<{ items: ItemCatalog }, ItemCatalog>((state) => state.items),
}
