import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"

export const getSpriteTasksBp = (sprite: SpriteData): number => {
  return sprite.services.max * BuilderConfig.technomancer.sprites.bpCost.perTask
}
