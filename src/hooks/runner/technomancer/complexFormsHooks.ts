import { useEntitySelector } from "#/contexts/entity/entityProvider.tsx"
import { ComplexFormsSelectors } from "#/stores/runner/complexForms/complexFormsSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

/** @deprecated Use `ComplexFormsSelectors.selectVisible` via `useRunnerSelector` instead. */
export const useComplexForms = () => {
  return useRunnerSelector(ComplexFormsSelectors.selectVisible)
}

/** @deprecated Use `ComplexFormsSelectors.selectMax` via `useEntitySelector` instead. */
export const useMaxComplexForms = () => {
  return useEntitySelector(ComplexFormsSelectors.selectMax)
}
