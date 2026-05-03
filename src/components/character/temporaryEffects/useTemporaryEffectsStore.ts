import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { TemporaryEffectsStore } from "./temporaryEffectsStore.ts"

export const useTemporaryEffectsStore = (): TemporaryEffectsStore => {
  const store = useCharacterSheetContext()

  return useMemo((): TemporaryEffectsStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.temporaryEffects ?? [],
      (root, temporaryEffects) => produce(root, (draft) => { draft.temporaryEffects = temporaryEffects }),
    )

    return new TemporaryEffectsStore(atom)
  }, [store])
}
