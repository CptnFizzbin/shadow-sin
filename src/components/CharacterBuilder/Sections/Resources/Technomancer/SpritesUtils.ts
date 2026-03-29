import { SpriteBpPerTask } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/TechnomancerUtils.ts"
import type { SpriteData } from "#/lib/system/magic/spriteData.ts"

export const getSpriteTasksBp = (sprite: SpriteData): number => {
  return sprite.services.max * SpriteBpPerTask
}
