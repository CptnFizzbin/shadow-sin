import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import { KarmaSelectors } from "#/state/runner/karma/karma.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"
import { ReputationStatType } from "#/system/model/reputation/reputationLedgerEntry.ts"

export namespace ReputationSelectors {
  /**
   * Selects the reputation ledger.
   */
  export const selectLedger = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.reputation.ledger,
  )

  /**
   * Selects the reputation ledger.
   */
  export const selectLedgerForType = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    SelectorOptions.repType,
    (runner, repType) => runner.reputation.ledger
      .filter((item) => item.stat === repType),
  )

  /**
   * Calculates Street Cred from total Karma earned + ledger entries.
   * Formula: floor(karma.total / 10) + sum of ledger entries where stat === "streetCred"
   */
  export const selectStreetCred = createMemoizedSelector(
    KarmaSelectors.selectTotal,
    injectOption(selectLedgerForType, { repType: ReputationStatType.streetCred }),
    (totalKarma, ledger) => {
      const baseStreetCred = Math.floor(totalKarma / 10)
      const ledgerTotal = ledger.reduce((sum, entry) => sum + entry.amount, 0)
      return baseStreetCred + ledgerTotal
    },
  )

  /**
   * Calculates Notoriety from base profile value + ledger entries.
   * Formula: profile.notoriety + sum of ledger entries where stat === "notoriety"
   */
  export const selectNotoriety = createMemoizedSelector(
    injectOption(selectLedgerForType, { repType: ReputationStatType.notoriety }),
    (ledger) => {
      return ledger.reduce((sum, entry) => sum + entry.amount, 0)
    },
  )

  /**
   * Calculates Public Awareness from Street Cred, Notoriety, and ledger adjustments.
   * Formula: floor((streetCred + notoriety) / 3) + sum of ledger entries where stat === "publicAwareness"
   */
  export const selectPublicAwareness = createMemoizedSelector(
    selectStreetCred,
    selectNotoriety,
    selectLedger,
    (streetCred, notoriety, ledger) => {
      const base = Math.floor((streetCred + notoriety) / 3)

      return base + ledger
        .filter((entry) => entry.stat === ReputationStatType.publicAwareness)
        .reduce((sum, entry) => sum + entry.amount, 0)
    },
  )

  /**
   * Selects the Public Awareness rating with its rank title: 0-1 New, 2-3 Known, 4-5 Criminal,
   * 6-7 Wanted, 8-9 Most Wanted, 10+ Legend. Ratings below 0 are titled "New".
   */
  export const selectPublicAwarenessInfo = createMemoizedSelector(
    selectPublicAwareness,
    (awareness) => {
      const ranks = [
        { title: "New", description: "" },
        { title: "Known", description: "" },
        { title: "Criminal", description: "" },
        { title: "Wanted", description: "" },
        { title: "Most Wanted", description: "" },
        { title: "Legend", description: "" },
      ]

      const index = Math.min(Math.max(Math.floor(awareness / 2), 0), ranks.length - 1)
      return { rating: awareness, ...ranks[index] }
    },
  )

  export const selectAll = createMemoizedSelector(
    selectStreetCred,
    selectNotoriety,
    selectPublicAwareness,
    (streetCred, notoriety, awareness) => ({
      streetCred,
      notoriety,
      awareness,
    }),
  )
}
