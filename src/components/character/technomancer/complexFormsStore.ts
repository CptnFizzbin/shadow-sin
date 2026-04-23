import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"

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
