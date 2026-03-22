import type { SpriteFormState } from "#/components/Character/Form/Resources/AwakenedFormState.ts"
import { SpriteBpPerTask } from "#/components/Character/Form/Resources/Technomancer/TechnomancerUtils.ts"

export const getSpriteTasksBp = (sprite: SpriteFormState): number => {
  return sprite.tasks * SpriteBpPerTask
}
