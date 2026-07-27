import { useSpendKarmaDialogContext } from "#/lib/contexts/improvements/spendKarmaDialogContext.tsx"
import { useRunnerStoreContext } from "#/lib/contexts/runner/runnerStore.context.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import {
  selectHasImprovements,
  selectImprovementsTotalCost,
} from "#/system/karma/improvements/improvementSelectors.ts"
import { applyImprovements } from "#/system/karma/improvements/improvementUtils.ts"

import { useImprovementSelector } from "./useImprovementSelector.ts"

export interface SpendKarmaSummary {
  currentKarma: number
  karmaCost: number
  remainingKarma: number
  isOverBudget: boolean
  canSave: boolean
  /** Applies the queued improvements to the runner. No-op when `canSave` is false. */
  saveImprovements: () => void
}

/** Karma budget numbers + save action for the Spend Karma dialog. */
export const useSpendKarmaSummary = (): SpendKarmaSummary => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const runnerDataStore = useRunnerStoreContext()

  const currentKarma = useRunnerStoreSelector(Selectors.karma.selectCurrentKarma)
  const karmaCost = useImprovementSelector(selectImprovementsTotalCost)
  const hasImprovements = useImprovementSelector(selectHasImprovements)

  const remainingKarma = currentKarma - karmaCost
  const isOverBudget = remainingKarma < 0
  const canSave = hasImprovements && !isOverBudget

  const saveImprovements = () => {
    if (!canSave) return
    applyImprovements(improvementStore, runnerDataStore)
  }

  return { currentKarma, karmaCost, remainingKarma, isOverBudget, canSave, saveImprovements }
}
