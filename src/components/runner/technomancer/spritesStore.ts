import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export type SpritesStoreState = RunnerData["sprites"]

export class SpritesStore extends StoreSlice<SpritesStoreState> {
  setState(stateOrUpdater: SpritesStoreState | ((prev: SpritesStoreState) => SpritesStoreState)) {
    this.set(stateOrUpdater)
  }

  add(sprite: SpriteData): void {
    this.set((prev) => [...prev, sprite])
  }

  update(sprite: SpriteData): void {
    this.set((prev) => prev.map((s) => s.id === sprite.id ? sprite : s))
  }

  remove(spriteId: string): void {
    this.set((prev) => prev.filter((s) => s.id !== spriteId))
  }

  save(sprite: SpriteData): void {
    if (!sprite.id || sprite.id === NullUuid) {
      this.add({ ...sprite, id: crypto.randomUUID() })
    } else {
      this.update(sprite)
    }
  }
}
