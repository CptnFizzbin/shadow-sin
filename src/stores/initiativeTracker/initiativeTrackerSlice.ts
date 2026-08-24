import { createReducer } from "@reduxjs/toolkit"

import type { InitiativeTrackerState } from "./initiativeTrackerData.ts"
import { sortCombatants } from "./initiativeTrackerData.ts"
import { addCombatant, endRound, nextTurn, removeCombatant, togglePass } from "./initiativeTrackerSlice.actions.ts"

export const initialState: InitiativeTrackerState = {
  combatants: [],
  round: 1,
  currentTurnId: null,
}

export const initiativeTrackerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addCombatant, (state, action) => {
      state.combatants.push(action.payload)
      state.currentTurnId ??= action.payload.id
    })
    .addCase(removeCombatant, (state, action) => {
      state.combatants = state.combatants.filter((combatant) => combatant.id !== action.payload)
      if (state.currentTurnId === action.payload) {
        state.currentTurnId = sortCombatants(state.combatants)[0]?.id ?? null
      }
    })
    .addCase(togglePass, (state, action) => {
      const combatant = state.combatants.find((c) => c.id === action.payload.id)
      if (!combatant) return
      const completed = new Set(combatant.passesCompleted)
      if (completed.has(action.payload.passIndex)) completed.delete(action.payload.passIndex)
      else completed.add(action.payload.passIndex)
      combatant.passesCompleted = Array.from(completed)
    })
    .addCase(nextTurn, (state) => {
      const sorted = sortCombatants(state.combatants)
      if (sorted.length === 0) return
      const currentIndex = sorted.findIndex((c) => c.id === state.currentTurnId)
      const nextIndex = (currentIndex + 1) % sorted.length
      state.currentTurnId = sorted[nextIndex]?.id ?? null
    })
    .addCase(endRound, (state) => {
      for (const combatant of state.combatants) {
        combatant.passesCompleted = []
      }
      state.currentTurnId = sortCombatants(state.combatants)[0]?.id ?? null
      state.round += 1
    })
})
