import { GameTableService } from "#/services/gameTable/gameTableService.ts"
import { KarmaSelectors } from "#/state/runner/karma/karma.selector.ts"
import { NuyenSelectors } from "#/state/runner/nuyen/nuyen.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

export interface KarmaPurchase {
  nuyenPerKarma: number
  currentKarma: number
  currentNuyen: number
  karmaAfter: number
  nuyenAfter: number
  /** False when the Runner lacks the nuyen to buy `amount` karma. */
  isAffordable: boolean
}

/** Before/after balances for buying `amount` karma with nuyen at the Table's rate. */
export const useKarmaPurchase = (amount: number): KarmaPurchase => {
  const currentKarma = useRunnerSelector(KarmaSelectors.selectCurrent)
  const currentNuyen = useRunnerSelector(NuyenSelectors.selectAmount)

  const { nuyenPerKarma } = GameTableService.karmaPurchaseRate
  const nuyenAfter = currentNuyen - amount * nuyenPerKarma

  return {
    nuyenPerKarma,
    currentKarma,
    currentNuyen,
    karmaAfter: currentKarma + amount,
    nuyenAfter,
    isAffordable: nuyenAfter >= 0,
  }
}
