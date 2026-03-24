import type { SpriteFormState } from "#/components/CharacterBuilder/Resources/AwakenedFormState.ts"
import { SpriteBpPerTask } from "#/components/CharacterBuilder/Resources/Technomancer/TechnomancerUtils.ts"

export const getSpriteTasksBp = (sprite: SpriteFormState): number => {
  return sprite.tasks * SpriteBpPerTask
}
