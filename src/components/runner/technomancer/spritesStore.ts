import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { addSprite, removeSprite, saveSprite, updateSprite } from "#/stores/runner/sprites/spritesSlice.actions.ts"
import { spritesReducer } from "#/stores/runner/sprites/spritesSlice.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export type SpritesStoreState = RunnerData["sprites"]

export class SpritesStore extends StoreSlice<SpritesStoreState> {
  setState(stateOrUpdater: SpritesStoreState | ((prev: SpritesStoreState) => SpritesStoreState)) {
    this.set(stateOrUpdater)
  }

  /** @deprecated Dispatch `addSprite` from `#/stores/runner/sprites/spritesSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  add(sprite: SpriteData): void {
    this.set((prev) => spritesReducer(prev, addSprite(sprite)))
  }

  /** @deprecated Dispatch `updateSprite` from `#/stores/runner/sprites/spritesSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  update(sprite: SpriteData): void {
    this.set((prev) => spritesReducer(prev, updateSprite(sprite)))
  }

  /** @deprecated Dispatch `removeSprite` from `#/stores/runner/sprites/spritesSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  remove(spriteId: string): void {
    this.set((prev) => spritesReducer(prev, removeSprite(spriteId)))
  }

  /** @deprecated Dispatch `saveSprite` from `#/stores/runner/sprites/spritesSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  save(sprite: SpriteData): void {
    this.set((prev) => spritesReducer(prev, saveSprite(sprite)))
  }
}
