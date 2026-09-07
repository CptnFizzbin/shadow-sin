import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import { KarmaSelectors } from "#/stores/runner/karma/karmaSlice.selectors.ts"
import { SelectorOptions } from "#/stores/runner/selectorOptions.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import { ReputationStatType } from "#/system/reputation/reputationLedgerEntry.ts"

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
   * Calculates Public Awareness modifier from base value + ledger entries.
   * Formula: profile.publicAwareness + sum of ledger entries where stat === "publicAwareness"
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

  export const selectPublicAwarenessRating = createMemoizedSelector(
    selectStreetCred,
    selectNotoriety,
    selectPublicAwareness,
    (streetCred, notoriety, modifier) => Math.floor((streetCred + notoriety + modifier) / 3),
  )

  export const selectPublicAwarenessInfo = createMemoizedSelector(
    selectPublicAwarenessRating,
    (awareness) => {
      const ranks = [{
        title: "Nobody",
        description: "",
      }, {
        title: "Shadow",
        description: "",
      }, {
        title: "Mentioned",
        description: "",
      }, {
        title: "Known",
        description: "",
      }, {
        title: "Wanted",
        description: "",
      }, {
        title: "Most Wanted",
        description: "",
      }, {
        title: "Legend",
        description: "",
      }, {
        title: "Mythical",
        description: "",
      }]

      const index = Math.min(awareness, ranks.length - 1)
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
