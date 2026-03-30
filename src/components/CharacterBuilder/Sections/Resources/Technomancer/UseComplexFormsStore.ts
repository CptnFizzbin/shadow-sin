import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetContext.tsx"
import { createSliceAtom } from "#/integrations/tanstack-store/AtomUtils.ts"
import { StoreSlice } from "#/integrations/tanstack-store/StoreSlice.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import type { ComplexFormData } from "#/lib/system/magic/complexFormData.ts"

export type ComplexFormsStoreState = CharacterSheet["complexForms"]

export class ComplexFormsStore extends StoreSlice<ComplexFormsStoreState> {
  setState(stateOrUpdater: ComplexFormsStoreState | ((prev: ComplexFormsStoreState) => ComplexFormsStoreState)) {
    this.set(stateOrUpdater)
  }

  add(form: ComplexFormData): void {
    this.set((prev) => [...prev, form])
  }

  update(form: ComplexFormData): void {
    this.set((prev) => prev.map((f) => f.id === form.id ? form : f))
  }

  remove(formId: string): void {
    this.set((prev) => prev.filter((f) => f.id !== formId))
  }
}

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
