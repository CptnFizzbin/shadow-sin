import { isTechnomancer } from "#/data/magic/technomancerUtils.ts"
import { BuilderConfig } from "#/rules/buildPoints/builderConfig.ts"
import { BuilderSectionId } from "#/state/builder/builderSectionId.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { ComplexFormsSelectors } from "#/state/runner/complexForms/complexForms.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import type { BpLineItem } from "./bpLineItem.ts"

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
