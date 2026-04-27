import { useSelector } from "@tanstack/react-store"
import { createSelector } from "reselect"

import type { DiceRoller } from "./diceRoller"
import type { DiceRollerState } from "./diceRoller.state.ts"
import type { DieState, SettledDieState } from "./dieState"
import { RollState } from "./rollState.ts"

export type DiceRollerSelector<T> = (state: DiceRollerState) => T

export function useDiceRollerSelector<T>(diceRoller: DiceRoller, selector: DiceRollerSelector<T>) {
  return useSelector(diceRoller.store, selector)
}

export const selectWasRolled: DiceRollerSelector<boolean> = (state) => {
  return state.dice.some((dice) => dice.value !== null)
}

export const selectIsRolling: DiceRollerSelector<boolean> = (state) => {
  return state.dice.some((die) => die.isRolling)
}

export const selectAllDice: DiceRollerSelector<DieState[]> = (state) => {
  return state.dice
}

export const selectAllSettled: DiceRollerSelector<boolean> = createSelector(
  selectAllDice,
  (dice) => dice.every((die) => !die.isRolling),
)

export const selectSettledDice: DiceRollerSelector<SettledDieState[]> = createSelector(
  selectAllDice,
  (dice) => dice.filter((die): die is SettledDieState => !die.isRolling),
)

export const selectHits: DiceRollerSelector<number> = createSelector(
  selectSettledDice,
  (dice) => dice.filter((die) => die.value >= 5).length,
)

export const selectIsGlitch: DiceRollerSelector<boolean> = (state) => {
  if (state.dice.length === 0) return false
  const ones = state.dice.filter((d) => d.value === 1).length
  return ones >= state.dice.length / 2
}

export const selectIsCriticalGlitch: DiceRollerSelector<boolean> = (state) => {
  if (state.dice.length === 0) return false
  const hits = state.dice.filter((d) => d.value !== null && d.value >= 5).length
  return selectIsGlitch(state) && hits === 0
}

export const selectRollState: DiceRollerSelector<RollState> = (state) => {
  if (!selectWasRolled(state)) return RollState.Assembling
  if (selectIsRolling(state)) return RollState.Rolling
  if (selectIsCriticalGlitch(state)) return RollState.Critical
  if (selectIsGlitch(state)) return RollState.Glitch
  if (selectHits(state) >= 1) return RollState.Hit
  return RollState.Miss
}
