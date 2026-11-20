import type { KarmaExchangeDirection } from "#/state/runner/karma/karma.selector.ts"
import { KarmaSelectors } from "#/state/runner/karma/karma.selector.ts"
import { NuyenSelectors } from "#/state/runner/nuyen/nuyen.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

export interface KarmaExchange {
  nuyenPerKarma: number
  currentKarma: number
  currentNuyen: number
  karmaAfter: number
  nuyenAfter: number
  /** False when the Runner lacks the nuyen to buy, or the karma to sell, `amount` karma. */
  isAffordable: boolean
}

/** Before/after balances for trading `amount` karma at the Runner's exchange rate. */
export const useKarmaExchange = (direction: KarmaExchangeDirection, amount: number): KarmaExchange => {
  const currentKarma = useRunnerSelector(KarmaSelectors.selectCurrent)
  const currentNuyen = useRunnerSelector(NuyenSelectors.selectAmount)

  const { nuyenPerKarma } = useRunnerSelector(KarmaSelectors.selectExchange)[direction]

  const isBuying = direction === "buy"
  const nuyenTotal = amount * nuyenPerKarma
  const karmaAfter = isBuying ? currentKarma + amount : currentKarma - amount
  const nuyenAfter = isBuying ? currentNuyen - nuyenTotal : currentNuyen + nuyenTotal

  return {
    nuyenPerKarma,
    currentKarma,
    currentNuyen,
    karmaAfter,
    nuyenAfter,
    isAffordable: isBuying ? nuyenAfter >= 0 : karmaAfter >= 0,
  }
}
