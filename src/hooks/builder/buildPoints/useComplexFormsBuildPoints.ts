import type { BpLineItem } from "#/components/buildPoints/bpLineItem.ts"
import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { isTechnomancer } from "#/components/technomancer/viewer/technomancerUtils.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { ComplexFormsSelectors } from "#/state/runner/complexForms/complexForms.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

export const useComplexFormsBuildPoints = (): BpLineItem => {
  const awakeningType = useRunnerSelector(BiologySelectors.selectAwakening)
  const complexForms = useRunnerSelector(ComplexFormsSelectors.selectVisible)

  const complexFormsBp = complexForms
    .map((form) => form.rating * BuilderConfig.technomancer.complexForms.bpCost.perRating)
    .reduce((total, cost) => total + cost, 0)

  return {
    sectionId: BuilderSectionId.complexForms,
    spent: complexFormsBp,
    enabled: isTechnomancer(awakeningType),
  }
}
