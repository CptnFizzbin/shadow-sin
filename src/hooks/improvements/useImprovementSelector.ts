import { useSpendKarmaDialogContext } from "#/components/runner/karma/spendKarmaDialogContext.tsx"
import { useSelector } from "#/integrations/reduxToolkit/useSelector.ts"
import type { ImprovementsSelector } from "#/services/improvements/improvementSelectors.ts"

export function useImprovementSelector<TData>(selector: ImprovementsSelector<TData>): TData {
  const { improvementStore } = useSpendKarmaDialogContext()
  return useSelector(improvementStore.store, selector)
}
