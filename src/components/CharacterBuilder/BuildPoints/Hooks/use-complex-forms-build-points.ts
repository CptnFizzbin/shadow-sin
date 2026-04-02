import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import type { BpLineItem } from "#/components/CharacterBuilder/BuildPoints/bp-line-item.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { useComplexForms } from "#/components/Technomancer/complex-forms-hooks.ts"
import { ComplexFormBpPerRating, isTechnomancer } from "#/components/Technomancer/technomancer-utils.ts"

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
