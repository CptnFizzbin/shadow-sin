import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { SpellsStore } from "#/components/character/spells/spellsStore.ts"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

export const useSpellsStore = (): SpellsStore => {
  const store = useCharacterSheetContext()

  return useMemo((): SpellsStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.spells,
      (root, spells) => produce(root, (draft) => { draft.spells = spells }),
    )

    return new SpellsStore(atom)
  }, [store])
}
