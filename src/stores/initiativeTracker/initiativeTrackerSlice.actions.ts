import { createAction } from "@reduxjs/toolkit"

import type { UUID } from "#/lib/uuidUtils.ts"

import type { Combatant } from "./initiativeTrackerData.ts"

export const addCombatant = createAction(
  "initiativeTracker/addCombatant",
  (combatant: Omit<Combatant, "id" | "passesCompleted">) => ({
    payload: { ...combatant, id: crypto.randomUUID(), passesCompleted: [] } as Combatant,
  }),
)

export const removeCombatant = createAction<UUID>("initiativeTracker/removeCombatant")

export const togglePass = createAction<{ id: UUID, passIndex: number }>("initiativeTracker/togglePass")

export const nextTurn = createAction("initiativeTracker/nextTurn")

export const endRound = createAction("initiativeTracker/endRound")
