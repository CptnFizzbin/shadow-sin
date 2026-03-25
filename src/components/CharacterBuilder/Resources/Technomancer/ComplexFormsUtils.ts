import type { ComplexFormFormState } from "#/components/CharacterBuilder/Resources/AwakenedFormState.ts"
import { ComplexFormBpPerRating } from "#/components/CharacterBuilder/Resources/Technomancer/TechnomancerUtils.ts"

export const getComplexFormBp = (complexForm: ComplexFormFormState): number => {
  return complexForm.rating * ComplexFormBpPerRating
}
