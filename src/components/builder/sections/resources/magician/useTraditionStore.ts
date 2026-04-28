import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { TraditionStore } from "./traditionStore.ts"

export const useTraditionStore = (): TraditionStore => {
  const store = useCharacterSheetContext()

  return useMemo((): TraditionStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.tradition,
      (root, tradition) =>
        produce(root, (draft) => {
          draft.tradition = tradition
        }),
    )

    return new TraditionStore(atom)
  }, [store])
}
