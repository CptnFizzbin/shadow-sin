import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import { useComplexForms } from "#/lib/hooks/runner/technomancer/complexFormsHooks.ts"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

export const useComplexFormsBuildPoints = (): BpLineItem => {
  const awakeningType = useRunnerStoreSelector((sheet) => sheet.biology.awakening)
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
