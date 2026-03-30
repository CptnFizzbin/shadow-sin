import type { BaseAtom } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetContext.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import type { ComplexFormData } from "#/lib/system/magic/complexFormData.ts"

export type ComplexFormsStoreState = CharacterSheet["complexForms"]

export interface UseComplexFormsStore extends BaseAtom<ComplexFormsStoreState> {
  add(form: ComplexFormData): void

  update(form: ComplexFormData): void

  remove(formId: string): void

  setState(state: ComplexFormsStoreState): void

  setState(updater: (prev: ComplexFormsStoreState) => ComplexFormsStoreState): void
}

export const useComplexFormsStore = (): UseComplexFormsStore => {
  const store = useCharacterSheetContext()

  return useMemo((): UseComplexFormsStore => {
    const complexFormsStore = createStore(() => store.state.complexForms)

    const toUpdater = <T>(valueOrUpdater: T | ((prev: T) => T)): ((prev: T) => T) =>
      typeof valueOrUpdater === "function"
        ? (valueOrUpdater as (prev: T) => T)
        : () => valueOrUpdater

    return {
      get: () => complexFormsStore.get(),
      subscribe: (listener) => complexFormsStore.subscribe(listener),

      setState: (stateOrUpdater) => {
        const updater = toUpdater(stateOrUpdater)
        store.setState(produce((prev) => {
          prev.complexForms = updater(prev.complexForms)
        }))
      },

      add: (form) => {
        store.setState(produce((prev) => {
          prev.complexForms.push(form)
        }))
      },

      update: (form) => {
        store.setState(produce((prev) => {
          prev.complexForms = prev.complexForms.map((f) => f.id === form.id ? form : f)
        }))
      },

      remove: (formId) => {
        store.setState(produce((prev) => {
          prev.complexForms = prev.complexForms.filter((f) => f.id !== formId)
        }))
      },
    }
  }, [store])
}
