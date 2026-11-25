import { AttributeKey } from "#data/attributes/attributeKey.ts"
import { createMemoizedSelector } from "#state/reselect/selectorUtils.ts"
import { AttrSelectors } from "#state/runner/attributes/attributes.selector.ts"
import { ViewerStateSelectors } from "#state/runner/viewerSelector.ts"

export namespace EdgeSelectors {
  export const selectMax = AttrSelectors.forAttr(AttributeKey.edge).selectValue

  export const selectCurrent = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.edge.current,
  )
}
