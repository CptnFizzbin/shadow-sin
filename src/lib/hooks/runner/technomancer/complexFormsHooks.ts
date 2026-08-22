import { useEntitySelector } from "#/lib/contexts/entity/entityProvider.tsx"
import { AttrSelectors } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { ComplexFormsSelectors } from "#/lib/stores/runner/complexForms/complexFormsSlice.selectors.ts"
import { Selectors, useRunnerSelector, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"

export const useComplexForms = () => {
  const awakeningType = useRunnerStoreSelector(Selectors.biology.selectAwakening)
  const complexForms = useRunnerSelector(ComplexFormsSelectors.selectAll)

  if (awakeningType !== AwakeningType.Technomancer) {
    return []
  }

  return complexForms
}

export const useMaxComplexForms = () => {
  return useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.logic }) * 2
}
