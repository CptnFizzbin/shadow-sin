import { useSpendKarmaDialogContext } from "#/contexts/improvements/spendKarmaDialogContext.tsx"
import { useSelector } from "#/integrations/reduxToolkit/useSelector.ts"
import type { ImprovementsSelector } from "#/system/karma/improvements/improvementSelectors.ts"

export function useImprovementSelector<TData>(selector: ImprovementsSelector<TData>): TData {
  const { improvementStore } = useSpendKarmaDialogContext()
  return useSelector(improvementStore.store, selector)
}
