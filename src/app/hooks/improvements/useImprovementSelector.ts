import { useSpendKarmaDialogContext } from "#/app/components/runner/karma/spendKarmaDialogContext.tsx"
import type { ImprovementsSelector } from "#/state/improvements/improvementSelectors.ts"
import { useSelector } from "#/state/reduxToolkit/useSelector.ts"

export function useImprovementSelector<TData>(selector: ImprovementsSelector<TData>): TData {
  const { improvementStore } = useSpendKarmaDialogContext()
  return useSelector(improvementStore.store, selector)
}
