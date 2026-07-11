import { produce } from "immer"
import { useMemo } from "react"

import { useRunnerDataContext } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { SkillsStore } from "./skillsStore.ts"

/** @deprecated Use `useRunnerStoreSelector(selectActiveSkills)` etc. from `#/stores/runner/skills/skillsSlice.selectors.ts` + `useRunnerStoreDispatch()` instead. */
export const useSkillsStore = (): SkillsStore => {
  const store = useRunnerDataContext()

  return useMemo((): SkillsStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.skills,
      (root, newSkills) => produce(root, (draft) => { draft.skills = newSkills }),
    )

    return new SkillsStore(atom)
  }, [store])
}
