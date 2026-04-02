import { SpriteBpPerTask } from "#/components/Technomancer/technomancer-utils.ts"
import type { SpriteData } from "#/lib/system/magic/sprite-data.ts"

export const getSpriteTasksBp = (sprite: SpriteData): number => {
  return sprite.services.max * SpriteBpPerTask
}
