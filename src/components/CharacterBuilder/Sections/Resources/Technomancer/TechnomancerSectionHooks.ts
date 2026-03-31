import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import {
  useComplexFormsBuildPoints,
} from "#/components/CharacterBuilder/BuildPoints/Hooks/UseComplexFormsBuildPoints.ts"
import { useSpritesBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/UseSpritesBuildPoints.ts"
import { isTechnomancer } from "#/components/Technomancer/TechnomancerUtils.ts"

export const useTechnomancerBuildPoints = () => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const complexFormsBuildPoints = useComplexFormsBuildPoints()
  const spritesBuildPoints = useSpritesBuildPoints()

  return {
    label: "Technomancer",
    spent: complexFormsBuildPoints.spent + spritesBuildPoints.spent,
    complexFormsSpent: complexFormsBuildPoints.spent,
    spritesSpent: spritesBuildPoints.spent,
    enabled: isTechnomancer(awakeningType),
  }
}
