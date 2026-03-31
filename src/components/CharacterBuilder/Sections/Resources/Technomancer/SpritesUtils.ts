import { SpriteBpPerTask } from "#/components/Technomancer/TechnomancerUtils.ts"
import type { SpriteData } from "#/lib/system/magic/spriteData.ts"

export const getSpriteTasksBp = (sprite: SpriteData): number => {
  return sprite.services.max * SpriteBpPerTask
}
