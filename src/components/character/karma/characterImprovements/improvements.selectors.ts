import { useSelector } from "@tanstack/react-store"

import {
  useSpendKarmaDialogContext,
} from "./forms/spendKarmaDialogContext.tsx"
import type { ImprovementsState } from "./improvementsStore.ts"
import type { AnyImprovement } from "./types/anyImprovement.ts"

export type ImprovementsSelector<TData> = (state: ImprovementsState) => TData

export function useImprovementsSelector<TData>(selector: ImprovementsSelector<TData>): TData {
  const { improvementsStore } = useSpendKarmaDialogContext()
  return useSelector(improvementsStore.store, selector)
}

export const selectQueuedImprovements: ImprovementsSelector<AnyImprovement[]> = (state) => {
  return state.improvements
}
