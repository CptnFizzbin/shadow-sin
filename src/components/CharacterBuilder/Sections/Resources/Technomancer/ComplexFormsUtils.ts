import type { ComplexFormFormState } from "#/components/CharacterBuilder/Sections/Resources/AwakenedFormState.ts"
import {
  ComplexFormBpPerRating,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/TechnomancerUtils.ts"

export const getComplexFormBp = (complexForm: ComplexFormFormState): number => {
  return complexForm.rating * ComplexFormBpPerRating
}
