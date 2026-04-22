import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { SkillsStore } from "#/components/skills/skillsStore.ts"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

export const useSkillsStore = (): SkillsStore => {
  const store = useCharacterSheetContext()

  return useMemo((): SkillsStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.skills,
      (root, newSkills) => produce(root, (draft) => { draft.skills = newSkills }),
    )

    return new SkillsStore(atom)
  }, [store])
}
