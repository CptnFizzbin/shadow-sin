import type { SpriteFormState } from "#/components/CharacterBuilder/Sections/Resources/AwakenedFormState.ts"
import { SpriteBpPerTask } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/TechnomancerUtils.ts"

export const getSpriteTasksBp = (sprite: SpriteFormState): number => {
  return sprite.tasks * SpriteBpPerTask
}
