import type { SpriteData } from "#/data/magic/spriteData.ts"

import { BuilderConfig } from "./builderConfig.ts"

export const getSpriteTasksBp = (sprite: SpriteData): number => {
  return sprite.services.max * BuilderConfig.technomancer.sprites.bpCost.perTask
}
