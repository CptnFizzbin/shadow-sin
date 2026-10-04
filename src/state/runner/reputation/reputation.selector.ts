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
   * Selects the Public Awareness rating with its rank title and flavour description: 0 New, 1-2 Known,
   * 3-5 Criminal, 6-7 Wanted, 8-9 Most Wanted, 10+ Legend. Ratings below 0 are ranked "New".
   */
  export const selectPublicAwarenessInfo = createMemoizedSelector(
    selectPublicAwareness,
    (awareness) => {
      const ranks = [{
        minRating: 10,
        title: "Legend",
        description: "You've made the record books. Everybody from the barrens to the arcologies knows your name, "
          + "and some trideo exec is already pitching the biopic.",
      }, {
        minRating: 8,
        title: "Most Wanted",
        description: "Most of the megacorps want a word, either because you're a prime asset or because you're "
          + "too much drek to leave breathing.",
      }, {
        minRating: 6,
        title: "Wanted",
        description: "You've kicked up enough drek that at least one megacorp has your name on a list.",
      }, {
        minRating: 3,
        title: "Criminal",
        description: "The shadow community knows your handle, chummer, and corp security has a dossier on you.",
      }, {
        minRating: 1,
        title: "Known",
        description: "Word's getting around the street. You're starting to make a name for yourself.",
      }, {
        minRating: -Infinity,
        title: "New",
        description: "Fresh meat on the scene. Nobody in the Sprawl knows your name, omae.",
      }]

      const rank = ranks.find((candidate) => awareness >= candidate.minRating)!
      return { rating: awareness, title: rank.title, description: rank.description }
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
