import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ProfileSelectors } from "#/stores/runner/profile/profileSlice.selectors.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"

export namespace ReputationSelectors {
  /**
   * Selects the reputation ledger.
   */
  export const selectLedger = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.reputation.ledger,
  )

  /**
   * Calculates Street Cred from base profile value + ledger entries.
   * Formula: profile.streetCred + sum of ledger entries where stat === "streetCred"
   */
  export const selectStreetCred = createMemoizedSelector(
    ProfileSelectors.selectStreetCred,
    selectLedger,
    (baseStreetCred, ledger) => {
      const ledgerTotal = ledger
        .filter((entry) => entry.stat === "streetCred")
        .reduce((sum, entry) => sum + entry.amount, 0)
      return baseStreetCred + ledgerTotal
    },
  )

  /**
   * Calculates Notoriety from base profile value + ledger entries.
   * Formula: profile.notoriety + sum of ledger entries where stat === "notoriety"
   */
  export const selectNotoriety = createMemoizedSelector(
    ProfileSelectors.selectNotoriety,
    selectLedger,
    (baseNotoriety, ledger) => {
      const ledgerTotal = ledger
        .filter((entry) => entry.stat === "notoriety")
        .reduce((sum, entry) => sum + entry.amount, 0)
      return baseNotoriety + ledgerTotal
    },
  )

  /**
   * Calculates Public Awareness modifier from base value + ledger entries.
   * Formula: profile.publicAwarenessModifier + sum of ledger entries where stat === "publicAwarenessModifier"
   */
  export const selectPublicAwarenessModifier = createMemoizedSelector(
    ProfileSelectors.selectPublicAwarenessModifier,
    selectLedger,
    (baseModifier, ledger) => {
      const ledgerTotal = ledger
        .filter((entry) => entry.stat === "publicAwarenessModifier")
        .reduce((sum, entry) => sum + entry.amount, 0)
      return baseModifier + ledgerTotal
    },
  )

  export const selectPublicAwarenessRating = createMemoizedSelector(
    selectStreetCred,
    selectNotoriety,
    selectPublicAwarenessModifier,
    (streetCred, notoriety, modifier) => Math.floor((streetCred + notoriety + modifier) / 3),
  )

  export const selectPublicAwareness = createMemoizedSelector(
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
