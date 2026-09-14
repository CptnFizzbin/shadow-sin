import { useSpendKarmaDialogContext } from "#/components/runner/karma/spendKarmaDialogContext.tsx"
import { useRunnerStoreContext } from "#/hooks/runner/useRunnerStore.ts"
import {
  selectHasImprovements,
  selectImprovementsTotalCost,
} from "#/services/improvements/improvementSelectors.ts"
import { KarmaSelectors } from "#/state/runner/karma/karma.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { applyImprovements } from "#/system/formulas/karma/improvements/improvementUtils.ts"

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

  const currentKarma = useRunnerSelector(KarmaSelectors.selectCurrent)
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
