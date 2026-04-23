import { ComplexFormBpPerRating } from "#/components/character/technomancer/technomancerUtils.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"

export const getComplexFormBp = (complexForm: ComplexFormData): number => {
  return complexForm.rating * ComplexFormBpPerRating
}
