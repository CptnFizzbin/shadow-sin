import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { ComplexFormsStore } from "./complexFormsStore.ts"

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
