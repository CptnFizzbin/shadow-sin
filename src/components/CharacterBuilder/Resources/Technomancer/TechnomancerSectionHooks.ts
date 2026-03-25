import { useComplexFormsBuildPoints } from "#/components/CharacterBuilder/Resources/Technomancer/ComplexFormsHooks.ts"
import { useSpritesBuildPoints } from "#/components/CharacterBuilder/Resources/Technomancer/SpritesHooks.ts"

export const useTechnomancerBuildPoints = () => {
  const complexFormsBuildPoints = useComplexFormsBuildPoints()
  const spritesBuildPoints = useSpritesBuildPoints()

  return {
    spent: complexFormsBuildPoints.spent + spritesBuildPoints.spent,
    complexFormsSpent: complexFormsBuildPoints.spent,
    spritesSpent: spritesBuildPoints.spent,
  }
}
