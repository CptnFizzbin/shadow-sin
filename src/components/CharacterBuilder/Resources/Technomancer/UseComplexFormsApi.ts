import { useStore } from "@tanstack/react-store"
import { produce } from "immer"

import { useCharacterBuilderStoreContext } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { ComplexFormFormState } from "#/components/CharacterBuilder/Resources/AwakenedFormState.ts"

export const useBuilderComplexFormsApi = () => {
  const store = useCharacterBuilderStoreContext()
  const complexForms = useStore(store, (state) => state.awakened.complexForms)

  return {
    complexForms,

    addComplexForm(form: ComplexFormFormState) {
      store.setState(produce((draft) => {
        draft.awakened.complexForms.push(form)
      }))
    },

    updateComplexForm(form: ComplexFormFormState) {
      store.setState(produce((draft) => {
        draft.awakened.complexForms = draft.awakened.complexForms.map((f) =>
          f.id === form.id ? form : f,
        )
      }))
    },

    removeComplexForm(formId: string) {
      store.setState(produce((draft) => {
        draft.awakened.complexForms = draft.awakened.complexForms.filter(
          (f) => f.id !== formId,
        )
      }))
    },
  }
}
