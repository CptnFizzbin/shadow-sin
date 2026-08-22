import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { AttrSelectors } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { EntityWithAttrs } from "#/system/entities/entityTraits.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** Standardized, namespaced selectors for the Edge domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace EdgeSelectors {
  export const selectMax: Selector<{ entity: EntityWithAttrs }, number> = (state) =>
    AttrSelectors.selectBase(state, { key: AttributeKey.edge })

  export const selectCurrent: Selector<{ runner: RunnerData }, number> = (state) => state.runner.edge.current
}
