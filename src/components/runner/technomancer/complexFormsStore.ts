import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { addComplexForm, removeComplexForm, saveComplexForm, updateComplexForm } from "#/stores/runner/complexForms/complexFormsSlice.actions.ts"
import { complexFormsReducer } from "#/stores/runner/complexForms/complexFormsSlice.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export type ComplexFormsStoreState = RunnerData["complexForms"]

export class ComplexFormsStore extends StoreSlice<ComplexFormsStoreState> {
  setState(stateOrUpdater: ComplexFormsStoreState | ((prev: ComplexFormsStoreState) => ComplexFormsStoreState)) {
    this.set(stateOrUpdater)
  }

  /** @deprecated Dispatch `addComplexForm` from `#/stores/runner/complexForms/complexFormsSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  add(form: ComplexFormData): void {
    this.set((prev) => complexFormsReducer(prev, addComplexForm(form)))
  }

  /** @deprecated Dispatch `updateComplexForm` from `#/stores/runner/complexForms/complexFormsSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  update(form: ComplexFormData): void {
    this.set((prev) => complexFormsReducer(prev, updateComplexForm(form)))
  }

  /** @deprecated Dispatch `removeComplexForm` from `#/stores/runner/complexForms/complexFormsSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  remove(formId: string): void {
    this.set((prev) => complexFormsReducer(prev, removeComplexForm(formId)))
  }

  /** @deprecated Dispatch `saveComplexForm` from `#/stores/runner/complexForms/complexFormsSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  save(form: ComplexFormData): void {
    this.set((prev) => complexFormsReducer(prev, saveComplexForm(form)))
  }
}
