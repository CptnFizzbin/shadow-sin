import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"

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
