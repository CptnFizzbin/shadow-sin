import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { ComplexFormsStore } from "#/components/character/technomancer/complexFormsStore.ts"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

export const useComplexFormsStore = (): ComplexFormsStore => {
  const store = useCharacterSheetContext()

  return useMemo((): ComplexFormsStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.complexForms,
      (root, complexForms) => produce(root, (draft) => { draft.complexForms = complexForms }),
    )

    return new ComplexFormsStore(atom)
  }, [store])
}
