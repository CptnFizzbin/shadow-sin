import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import type { BpLineItem } from "#/components/CharacterBuilder/BuildPoints/BpLineItem.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"
import { useComplexForms } from "#/components/Technomancer/ComplexFormsHooks.ts"
import { ComplexFormBpPerRating, isTechnomancer } from "#/components/Technomancer/TechnomancerUtils.ts"

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
