import { produce } from "immer"
import { useMemo } from "react"

import { useRunnerDataContext } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { KarmaStore } from "./karmaStore.ts"

export function useKarmaStore() {
  const store = useRunnerDataContext()

  return useMemo((): KarmaStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.karma,
      (root, karma) => produce(root, (draft) => { draft.karma = karma }),
    )
    return new KarmaStore(atom)
  }, [store])
}
