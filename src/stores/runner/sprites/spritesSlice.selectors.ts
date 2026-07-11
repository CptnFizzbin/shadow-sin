import type { SpriteData } from "#/system/magic/spriteData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectSprites(state: RunnerData): SpriteData[] {
  return state.sprites
}
