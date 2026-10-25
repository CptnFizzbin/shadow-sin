import { GameTableService } from "#/services/gameTable/gameTableService.ts"
import { KarmaSelectors } from "#/state/runner/karma/karma.selector.ts"
import { NuyenSelectors } from "#/state/runner/nuyen/nuyen.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

/** `buy` trades nuyen for karma; `sell` trades karma for nuyen. */
export type KarmaExchangeDirection = "buy" | "sell"

export interface KarmaExchange {
  nuyenPerKarma: number
  currentKarma: number
  currentNuyen: number
  karmaAfter: number
  nuyenAfter: number
  /** False when the Runner lacks the nuyen to buy, or the karma to sell, `amount` karma. */
  isAffordable: boolean
}

/** Before/after balances for trading `amount` karma at the Table's exchange rate. */
export const useKarmaExchange = (direction: KarmaExchangeDirection, amount: number): KarmaExchange => {
  const currentKarma = useRunnerSelector(KarmaSelectors.selectCurrent)
  const currentNuyen = useRunnerSelector(NuyenSelectors.selectAmount)

  const isBuying = direction === "buy"
  const { buyNuyenPerKarma, sellNuyenPerKarma } = GameTableService.karmaExchangeRates
  const nuyenPerKarma = isBuying ? buyNuyenPerKarma : sellNuyenPerKarma
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
