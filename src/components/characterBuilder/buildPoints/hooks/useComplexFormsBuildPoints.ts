import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import type { BpLineItem } from "#/components/characterBuilder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import { useComplexForms } from "#/components/technomancer/complexFormsHooks.ts"
import { ComplexFormBpPerRating, isTechnomancer } from "#/components/technomancer/technomancerUtils.ts"

export const useComplexFormsBuildPoints = (): BpLineItem => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
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
