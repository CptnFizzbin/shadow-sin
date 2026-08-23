import { useEntitySelector } from "#/lib/contexts/entity/entityProvider.tsx"
import { ComplexFormsSelectors } from "#/lib/stores/runner/complexForms/complexFormsSlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

/** @deprecated Use `ComplexFormsSelectors.selectVisible` via `useRunnerSelector` instead. */
export const useComplexForms = () => {
  return useRunnerSelector(ComplexFormsSelectors.selectVisible)
}

/** @deprecated Use `ComplexFormsSelectors.selectMax` via `useEntitySelector` instead. */
export const useMaxComplexForms = () => {
  return useEntitySelector(ComplexFormsSelectors.selectMax)
}
