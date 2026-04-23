import type { InitiativePassState } from "#/components/initiative/initiativePassStore.ts"

export const selectPassesCompleted = (state: InitiativePassState) => state.passesCompleted
