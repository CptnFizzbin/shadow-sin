import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { AwakeningType } from "#/system/model/magic/awakeningType.ts"

export namespace ComplexFormsSelectors {
  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.complexForms,
  )

  /** {@link selectAll}, or empty for a runner who isn't a Technomancer. */
  export const selectVisible = createMemoizedSelector(
    BiologySelectors.selectAwakening,
    selectAll,
    (awakening, complexForms) => awakening === AwakeningType.Technomancer ? complexForms : [],
  )

  /** Maximum number of Complex Forms a Technomancer can run at once — twice their Logic. */
  export const selectMax = createMemoizedSelector(
    AttrSelectors.forAttr(AttributeKey.logic).selectValue,
    (logic) => logic * 2,
  )
}
