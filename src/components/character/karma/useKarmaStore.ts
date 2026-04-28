import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { KarmaStore } from "./karmaStore.ts"

export { KarmaStore } from "#/components/character/karma/karmaStore.ts"

export function useKarmaStore() {
  const store = useCharacterSheetContext()

  return useMemo((): KarmaStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.karma,
      (root, karma) => produce(root, (draft) => { draft.karma = karma }),
    )
    return new KarmaStore(atom)
  }, [store])
}
