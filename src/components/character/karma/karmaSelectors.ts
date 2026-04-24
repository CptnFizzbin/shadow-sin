import type { KarmaState } from "#/components/character/karma/karmaStore.ts"

export const selectCurrentKarma = (state: KarmaState) => state.current
export const selectTotalKarma = (state: KarmaState) => state.total
