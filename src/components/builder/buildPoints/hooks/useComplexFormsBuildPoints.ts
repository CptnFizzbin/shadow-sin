import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { useComplexForms } from "#/components/runner/technomancer/complexFormsHooks.ts"
import { ComplexFormBpPerRating, isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const useComplexFormsBuildPoints = (): BpLineItem => {
  const awakeningType = useRunnerStoreSelector((sheet) => sheet.biology.awakening)
  const complexForms = useComplexForms()

  const complexFormsBp = complexForms
    .map((form) => form.rating * ComplexFormBpPerRating)
    .reduce((total, cost) => total + cost, 0)

  return {
    sectionId: BuilderSectionId.complexForms,
    spent: complexFormsBp,
    enabled: isTechnomancer(awakeningType),
  }
}
