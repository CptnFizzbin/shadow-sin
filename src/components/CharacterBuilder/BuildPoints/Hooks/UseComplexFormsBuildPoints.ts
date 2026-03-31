import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import { useComplexForms } from "#/components/Technomancer/ComplexFormsHooks.ts"
import { ComplexFormBpPerRating } from "#/components/Technomancer/TechnomancerUtils.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"

export const useComplexFormsBuildPoints = () => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const complexForms = useComplexForms()

  if (awakeningType !== AwakeningType.Technomancer) {
    return { spent: 0 }
  }

  const complexFormsBp = complexForms
    .map((form) => form.rating * ComplexFormBpPerRating)
    .reduce((total, cost) => total + cost, 0)

  return { spent: complexFormsBp }
}
