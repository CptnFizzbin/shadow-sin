import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const useHasMaxxedAttribute = (): boolean => {
  return useRunnerSelector(AttrSelectors.selectActive).some((attr) => attr.value >= attr.max)
}
