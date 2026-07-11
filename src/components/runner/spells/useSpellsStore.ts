import { produce } from "immer"
import { useMemo } from "react"

import { useRunnerDataContext } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { SpellsStore } from "./spellsStore.ts"

export const useSpellsStore = (): SpellsStore => {
  const store = useRunnerDataContext()

  return useMemo((): SpellsStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.spells,
      (root, spells) => produce(root, (draft) => { draft.spells = spells }),
    )

    return new SpellsStore(atom)
  }, [store])
}
