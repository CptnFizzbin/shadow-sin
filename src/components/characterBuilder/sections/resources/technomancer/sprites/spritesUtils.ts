import { SpriteBpPerTask } from "#/components/technomancer/technomancerUtils.ts"
import type { SpriteData } from "#/lib/system/magic/spriteData.ts"

export const getSpriteTasksBp = (sprite: SpriteData): number => {
  return sprite.services.max * SpriteBpPerTask
}
