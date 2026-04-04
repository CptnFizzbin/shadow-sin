import { ComplexFormBpPerRating } from "#/components/Technomancer/technomancer-utils.ts"
import type { ComplexFormData } from "#/lib/system/magic/complex-form-data.ts"

export const getComplexFormBp = (complexForm: ComplexFormData): number => {
  return complexForm.rating * ComplexFormBpPerRating
}
