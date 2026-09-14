import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import type { SpriteData } from "#/system/model/magic/spriteData.ts"

export const getSpriteTasksBp = (sprite: SpriteData): number => {
  return sprite.services.max * BuilderConfig.technomancer.sprites.bpCost.perTask
}
