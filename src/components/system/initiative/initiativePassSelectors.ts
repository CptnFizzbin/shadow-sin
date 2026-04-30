import type { InitiativePassState } from "./initiativePassStore.ts"

export const selectPassesCompleted = (state: InitiativePassState) => state.passesCompleted
export const selectRolledResults = (state: InitiativePassState) => state.rolledResults
export const selectGoingFirst = (state: InitiativePassState) => state.goingFirst === true
export const selectExtraPasses = (state: InitiativePassState) => state.extraPasses
