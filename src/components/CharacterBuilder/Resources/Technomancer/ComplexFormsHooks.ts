import {
  useBuilderAttrValue,
  useBuilderAwakeningType,
} from "#/components/CharacterBuilder/CharacterBuilderHooks.ts"
import { ComplexFormBpPerRating } from "#/components/CharacterBuilder/Resources/Technomancer/TechnomancerUtils.ts"
import { useBuilderComplexFormsApi } from "#/components/CharacterBuilder/Resources/Technomancer/UseComplexFormsApi.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"

export const useComplexForms = () => {
  const awakeningType = useBuilderAwakeningType()
  const { complexForms } = useBuilderComplexFormsApi()

  if (awakeningType !== AwakeningType.Technomancer) {
    return []
  }

  return complexForms
}

export const useComplexFormsBuildPoints = () => {
  const awakeningType = useBuilderAwakeningType()
  const complexForms = useComplexForms()

  if (awakeningType !== AwakeningType.Technomancer) {
    return { spent: 0 }
  }

  const complexFormsBp = complexForms
    .map((form) => form.rating * ComplexFormBpPerRating)
    .reduce((total, cost) => total + cost, 0)

  return { spent: complexFormsBp }
}

export const useMaxComplexForms = () => {
  return useBuilderAttrValue(AttributeKey.logic) * 2
}
