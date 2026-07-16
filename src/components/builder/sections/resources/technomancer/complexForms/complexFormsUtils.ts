import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"

export const getComplexFormBp = (complexForm: ComplexFormData): number => {
  return complexForm.rating * BuilderConfig.technomancer.complexForms.bpCost.perRating
}
