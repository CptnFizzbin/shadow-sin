import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const useHasMaxxedAttribute = (): boolean => {
  return useRunnerSelector(AttrSelectors.selectActive)
    // AI's computed rows (Rating/System/Firewall/Response/Signal) aren't raisable — ignore them.
    .filter((attr) => !attr.computed)
    .some((attr) => attr.value >= attr.max)
}
