import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { AttrSelectors } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

export namespace EdgeSelectors {
  export const selectMax = AttrSelectors.forAttr(AttributeKey.edge).selectValue

  export const selectCurrent = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.edge.current,
  )
}
