import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { ComplexFormsSelectors } from "#/stores/runner/complexForms/complexFormsSlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export const selectComplexFormsBuildPoints: Selector<{ runner: RunnerData }, BpLineItem> = createMemoizedSelector(
  BiologySelectors.selectAwakening,
  ComplexFormsSelectors.selectVisible,
  (awakeningType, complexForms): BpLineItem => {
    const complexFormsBp = complexForms
      .map((form) => form.rating * BuilderConfig.technomancer.complexForms.bpCost.perRating)
      .reduce((total, cost) => total + cost, 0)

    return {
      sectionId: BuilderSectionId.complexForms,
      spent: complexFormsBp,
      enabled: isTechnomancer(awakeningType),
    }
  },
)
