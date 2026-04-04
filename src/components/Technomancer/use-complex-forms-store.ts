import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/character-sheet-provider.tsx"
import { createSliceAtom } from "#/integrations/tanstack-store/atom-utils.ts"
import { StoreSlice } from "#/integrations/tanstack-store/store-slice.ts"
import type { CharacterSheet } from "#/lib/system/character-sheet.ts"
import type { ComplexFormData } from "#/lib/system/magic/complex-form-data.ts"
import { NullUuid } from "#/lib/uuid-utils.ts"

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

  save(form: ComplexFormData): void {
    if (!form.id || form.id === NullUuid) {
      this.add({ ...form, id: crypto.randomUUID() })
    } else {
      this.update(form)
    }
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
