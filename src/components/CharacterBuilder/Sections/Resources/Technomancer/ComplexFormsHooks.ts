import { useStore } from "@tanstack/react-store"

import { useBuilderAttrValue } from "#/components/CharacterBuilder/Hooks/UseBuilderAttrValue.ts"
import { useBuilderAwakeningType } from "#/components/CharacterBuilder/Hooks/UseBuilderAwakeningType.ts"
import {
  ComplexFormBpPerRating,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/TechnomancerUtils.ts"
import { useComplexFormsStore } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/UseComplexFormsStore.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"

export const useComplexForms = () => {
  const awakeningType = useBuilderAwakeningType()
  const complexFormsStore = useComplexFormsStore()
  const complexForms = useStore(complexFormsStore, (state) => state)

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
