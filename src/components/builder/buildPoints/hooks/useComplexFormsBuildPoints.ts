import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { useComplexForms } from "#/components/character/technomancer/complexFormsHooks.ts"
import { ComplexFormBpPerRating, isTechnomancer } from "#/components/character/technomancer/technomancerUtils.ts"

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
