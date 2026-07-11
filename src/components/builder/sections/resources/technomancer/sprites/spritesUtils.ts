import { SpriteBpPerTask } from "#/components/runner/technomancer/technomancerUtils.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"

export const getSpriteTasksBp = (sprite: SpriteData): number => {
  return sprite.services.max * SpriteBpPerTask
}
