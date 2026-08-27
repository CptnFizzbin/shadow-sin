import { createMemoizedSelector, createSelector } from "#/integrations/reselect/selectorUtils.ts"
import { KarmaSelectors } from "#/stores/runner/karma/karmaSlice.selectors.ts"

export namespace ReputationSelectors {
  export const selectStreetCred = createMemoizedSelector(
    KarmaSelectors.selectTotal,
    (totalKarma) => Math.round(totalKarma / 10),
  )

  // TODO: add support for logging changes to reputation
  export const selectNotoriety = createSelector(() => 0)

  export const selectPublicAwarenessRating = createMemoizedSelector(
    selectStreetCred,
    selectNotoriety,
    (steetCred, notoriety) => Math.floor((steetCred + notoriety) / 3),
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
