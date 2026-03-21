import { CharacterBuilderHooks } from "#/components/Character/Form/CharacterBuilderHooks.ts"
import { useCharacterBuilderStoreSlice } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { ComplexFormBpPerRating } from "#/components/Character/Form/Resources/Technomancer/TechnomancerRequirements.ts"
import { AwakeningType } from "#/lib/system/types/awakeningType.ts"

export const useComplexFormsSlice = () => {
  return useCharacterBuilderStoreSlice(
    (state) => state.awakened.complexForms,
    (state, complexForms) => {
      state.awakened.complexForms = complexForms
      return state
    },
  )
}

export const useComplexForms = () => {
  const awakeningType = CharacterBuilderHooks.useAwakeningType()
  const complexFormsSlice = useComplexFormsSlice()

  if (awakeningType !== AwakeningType.Technomancer) {
    return []
  }

  return complexFormsSlice.state
}

export const useTechnomancerBuildPoints = () => {
  const awakeningType = CharacterBuilderHooks.useAwakeningType()
  const complexForms = useComplexForms()

  if (awakeningType !== AwakeningType.Technomancer) {
    return { spent: 0 }
  }

  const spent = complexForms
    .map((form) => form.rating * ComplexFormBpPerRating)
    .reduce((total, cost) => total + cost, 0)

  return { spent }
}
