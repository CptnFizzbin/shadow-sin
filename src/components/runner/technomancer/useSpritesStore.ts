import { produce } from "immer"
import { useMemo } from "react"

import { useRunnerDataContext } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { SpritesStore } from "./spritesStore.ts"

/** @deprecated Use `useRunnerStoreSelector(selectSprites)` from `#/stores/runner/sprites/spritesSlice.selectors.ts` + `useRunnerStoreDispatch()` instead. */
export const useSpritesStore = (): SpritesStore => {
  const store = useRunnerDataContext()

  return useMemo((): SpritesStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.sprites,
      (root, sprites) => produce(root, (draft) => { draft.sprites = sprites }),
    )

    return new SpritesStore(atom)
  }, [store])
}
