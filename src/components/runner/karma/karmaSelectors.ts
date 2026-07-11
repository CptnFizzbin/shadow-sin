import type { KarmaState } from "./karmaStore.ts"

export const selectCurrentKarma = (state: KarmaState) => state.current
export const selectTotalKarma = (state: KarmaState) => state.total
