import type { ComplexFormFormState } from "#/components/Character/Form/Resources/AwakenedFormState.ts"
import { ComplexFormBpPerRating } from "#/components/Character/Form/Resources/Technomancer/TechnomancerUtils.ts"

export const getComplexFormBp = (complexForm: ComplexFormFormState): number => {
  return complexForm.rating * ComplexFormBpPerRating
}
