import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

import { selectActiveAttributes } from "./useActiveAttributes.ts"

export const useHasMaxxedAttribute = (): boolean => {
  return useRunnerSelector(selectActiveAttributes).some((attr) => attr.value >= attr.max)
}
