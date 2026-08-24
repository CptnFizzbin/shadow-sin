import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { ComplexFormsSelectors } from "#/stores/runner/complexForms/complexFormsSlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export const selectComplexFormsAlerts: Selector<{ runner: RunnerData }, AlertInfo[]> = createMemoizedSelector(
  BiologySelectors.selectAwakening,
  ComplexFormsSelectors.selectAll,
  (awakeningType, complexForms): AlertInfo[] => {
    if (!isTechnomancer(awakeningType)) return []

    if (complexForms.length === 0) {
      return [{
        section: "Complex Forms",
        severity: "warning",
        title: "No complex forms",
        message: "No complex forms added. Add complex forms to enable technomancer abilities that rely on them.",
        summaryOnly: true,
      }]
    }

    return []
  },
)
