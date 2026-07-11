import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { addSprite, removeSprite, saveSprite, spritesSlice, updateSprite } from "#/stores/runner/sprites/spritesSlice.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export type SpritesStoreState = RunnerData["sprites"]

export class SpritesStore extends StoreSlice<SpritesStoreState> {
  setState(stateOrUpdater: SpritesStoreState | ((prev: SpritesStoreState) => SpritesStoreState)) {
    this.set(stateOrUpdater)
  }

  /** @deprecated Dispatch `addSprite` from `#/stores/runner/sprites/spritesSlice.ts` via `useRunnerStoreDispatch()` instead. */
  add(sprite: SpriteData): void {
    this.set((prev) => spritesSlice.reducer(prev, addSprite(sprite)))
  }

  /** @deprecated Dispatch `updateSprite` from `#/stores/runner/sprites/spritesSlice.ts` via `useRunnerStoreDispatch()` instead. */
  update(sprite: SpriteData): void {
    this.set((prev) => spritesSlice.reducer(prev, updateSprite(sprite)))
  }

  /** @deprecated Dispatch `removeSprite` from `#/stores/runner/sprites/spritesSlice.ts` via `useRunnerStoreDispatch()` instead. */
  remove(spriteId: string): void {
    this.set((prev) => spritesSlice.reducer(prev, removeSprite(spriteId)))
  }

  /** @deprecated Dispatch `saveSprite` from `#/stores/runner/sprites/spritesSlice.ts` via `useRunnerStoreDispatch()` instead. */
  save(sprite: SpriteData): void {
    this.set((prev) => spritesSlice.reducer(prev, saveSprite(sprite)))
  }
}
