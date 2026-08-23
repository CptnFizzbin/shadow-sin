import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ItemSelectors } from "#/lib/stores/runner/gear/gearSlice.selectors.ts"
import { NuyenSelectors } from "#/lib/stores/runner/nuyen/nuyenSlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { isCredstickData } from "#/system/gear/credstickData.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** `items` is only pulled in for `ItemSelectors.selectAll` — see docs/adr/0014-selector-input-decomposition.md
 *  on why a multi-source selector intersects the wrapper shapes it needs instead of taking bare `RunnerData`. */
type NetWorthState = { runner: RunnerData } & { items: ItemCatalog }

/**
 * Nuyen on hand, plus every credstick's balance and the sale value of all other gear, minus
 * outstanding loans.
 */
export const selectNetWorth: Selector<NetWorthState, number> = createMemoizedSelector(
  NuyenSelectors.selectAmount,
  NuyenSelectors.selectLoans,
  ItemSelectors.selectAll,
  (currentNuyen, loans, items) => {
    const allGear = Object.values(items)

    const credstickTotal = allGear
      .filter(isCredstickData)
      .reduce((sum, credstick) => sum + credstick.balance, 0)

    const gearTotal = allGear
      .filter((item) => !isCredstickData(item))
      .reduce((sum, item) => sum + (item.cost ?? 0) * (item.quantity ?? 1), 0)

    const loansTotal = loans.reduce((sum, loan) => sum + loan.amount, 0)

    return currentNuyen + gearTotal + credstickTotal - loansTotal
  },
)

/** @deprecated Use {@link selectNetWorth} via `useRunnerSelector` instead. */
export function useNetWorth(): number {
  return useRunnerSelector(selectNetWorth)
}
