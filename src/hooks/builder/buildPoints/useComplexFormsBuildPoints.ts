import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import { useComplexForms } from "#/hooks/runner/technomancer/complexFormsHooks.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const useComplexFormsBuildPoints = (): BpLineItem => {
  const awakeningType = useRunnerSelector(BiologySelectors.selectAwakening)
  const complexForms = useComplexForms()

  const complexFormsBp = complexForms
    .map((form) => form.rating * BuilderConfig.technomancer.complexForms.bpCost.perRating)
    .reduce((total, cost) => total + cost, 0)

  return {
    sectionId: BuilderSectionId.complexForms,
    spent: complexFormsBp,
    enabled: isTechnomancer(awakeningType),
  }
}
