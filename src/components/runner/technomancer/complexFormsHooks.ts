import { useAttrValue } from "#/components/runner/attributes/attributesProvider.tsx"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"

export const useComplexForms = () => {
  const awakeningType = useRunnerStoreSelector(Selectors.biology.selectAwakening)
  const complexForms = useRunnerStoreSelector(Selectors.complexForms.selectComplexForms)

  if (awakeningType !== AwakeningType.Technomancer) {
    return []
  }

  return complexForms
}

export const useMaxComplexForms = () => {
  return useAttrValue(AttributeKey.logic) * 2
}
