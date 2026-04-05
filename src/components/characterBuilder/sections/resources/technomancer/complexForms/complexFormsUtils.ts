import { ComplexFormBpPerRating } from "#/components/technomancer/technomancerUtils.ts"
import type { ComplexFormData } from "#/lib/system/magic/complexFormData.ts"

export const getComplexFormBp = (complexForm: ComplexFormData): number => {
  return complexForm.rating * ComplexFormBpPerRating
}
