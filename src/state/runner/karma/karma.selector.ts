import { resolveFlagValue } from "#/data/featureFlags/featureFlagsData.ts"
import { houseRules } from "#/data/featureFlags/houseRules.ts"
import { createMemoizedSelector } from "#/state/reselect/selectorUtils.ts"
import { FeatureFlagSelectors } from "#/state/runner/featureFlags/featureFlags.selector.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"

/** Whether trading karma one way is allowed, and its rate. */
interface KarmaExchangeRule {
  enabled: boolean
  nuyenPerKarma: number
}

/** The House Rules for trading karma for nuyen and back. */
interface KarmaExchangeRules {
  /** Trading nuyen for karma. */
  buy: KarmaExchangeRule
  /** Trading karma for nuyen. */
  sell: KarmaExchangeRule
}

/** A direction karma can be traded in. */
export type KarmaExchangeDirection = keyof KarmaExchangeRules

export namespace KarmaSelectors {
  export const select = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.karma,
  )

  export const selectCurrent = createMemoizedSelector(
    select,
    (karma) => karma.current,
  )

  export const selectLog = createMemoizedSelector(
    select,
    (karma) => karma.log,
  )

  export const selectTotal = createMemoizedSelector(
    select,
    (karma) => karma.total,
  )

  /** Whether the Runner may buy and sell karma for nuyen, and at what rates. */
  export const selectExchange = createMemoizedSelector(
    FeatureFlagSelectors.selectAll,
    (featureFlags): KarmaExchangeRules => ({
      buy: {
        enabled: resolveFlagValue(featureFlags, houseRules["karma.buy.enabled"]),
        nuyenPerKarma: resolveFlagValue(featureFlags, houseRules["karma.buy.nuyenPerKarma"]),
      },
      sell: {
        enabled: resolveFlagValue(featureFlags, houseRules["karma.sell.enabled"]),
        nuyenPerKarma: resolveFlagValue(featureFlags, houseRules["karma.sell.nuyenPerKarma"]),
      },
    }),
  )
}
