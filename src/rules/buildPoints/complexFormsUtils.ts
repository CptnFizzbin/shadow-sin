import type { ComplexFormData } from "#data/magic/complexFormData.ts"

import { BuilderConfig } from "./builderConfig.ts"

export const getComplexFormBp = (complexForm: ComplexFormData): number => {
  return complexForm.rating * BuilderConfig.technomancer.complexForms.bpCost.perRating
}
