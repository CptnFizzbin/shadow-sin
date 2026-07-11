import type { SpritesStoreState } from "./spritesStore.ts"

/** @deprecated Use `selectSprites` from `#/stores/runner/sprites/spritesSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `SpritesStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectAllSprites = (state: SpritesStoreState) => state
