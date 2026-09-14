import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"

export namespace EdgeSelectors {
  export const selectMax = AttrSelectors.forAttr(AttributeKey.edge).selectValue

  export const selectCurrent = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.edge.current,
  )
}
