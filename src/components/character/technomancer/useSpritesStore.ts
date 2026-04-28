import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { SpritesStore } from "./spritesStore.ts"

export const useSpritesStore = (): SpritesStore => {
  const store = useCharacterSheetContext()

  return useMemo((): SpritesStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.sprites,
      (root, sprites) => produce(root, (draft) => { draft.sprites = sprites }),
    )

    return new SpritesStore(atom)
  }, [store])
}
