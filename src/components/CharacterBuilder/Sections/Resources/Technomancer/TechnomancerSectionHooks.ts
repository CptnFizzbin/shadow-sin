import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import {
  useComplexFormsBuildPoints,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/ComplexFormsHooks.ts"
import { useSpritesBuildPoints } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/SpritesHooks.ts"
import { isTechnomancer } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/TechnomancerUtils.ts"

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
