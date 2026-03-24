import {
  useBuilderAttrValue,
  useBuilderAwakeningType,
} from "#/components/Character/Form/CharacterBuilderHooks.ts"
import { ComplexFormBpPerRating } from "#/components/Character/Form/Resources/Technomancer/TechnomancerUtils.ts"
import { useBuilderStoreSlice } from "#/components/CharacterBuilder/BuilderStoreProvider.tsx"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import { AwakeningType } from "#/lib/system/types/awakeningType.ts"

export const useComplexFormsSlice = () => {
  return useBuilderStoreSlice(
    (state) => state.awakened.complexForms,
    (state, complexForms) => {
      state.awakened.complexForms = complexForms
      return state
    },
  )
}
export const useComplexForms = () => {
  const awakeningType = useBuilderAwakeningType()
  const complexFormsSlice = useComplexFormsSlice()

  if (awakeningType !== AwakeningType.Technomancer) {
    return []
  }

  return complexFormsSlice.state
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
