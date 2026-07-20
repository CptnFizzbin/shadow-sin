import { useMemo, useState } from "react"

import type { Combatant } from "./initiativeTrackerTypes.ts"
import { MOCK_COMBATANTS } from "./initiativeTrackerTypes.ts"

let nextCombatantId = 0

/**
 * PROTOTYPE — in-memory state shared by the Initiative Tracker layout
 * variants. Seeded with mock combatants; nothing here persists.
 */
export const useInitiativeTrackerState = () => {
  const [combatants, setCombatants] = useState<Combatant[]>(MOCK_COMBATANTS)
  const [round, setRound] = useState(1)
  const [currentTurnId, setCurrentTurnId] = useState<string | null>(MOCK_COMBATANTS[0]?.id ?? null)

  const sortedCombatants = useMemo(
    () => [...combatants].sort((a, b) => b.score - a.score),
    [combatants],
  )

  const currentIndex = sortedCombatants.findIndex((combatant) => combatant.id === currentTurnId)

  const addCombatant = (input: Omit<Combatant, "id" | "passesCompleted">) => {
    const combatant: Combatant = { ...input, id: `custom-${nextCombatantId++}`, passesCompleted: [] }
    setCombatants((prev) => [...prev, combatant])
    setCurrentTurnId((prev) => prev ?? combatant.id)
  }

  const removeCombatant = (id: string) => {
    setCombatants((prev) => prev.filter((combatant) => combatant.id !== id))
    if (currentTurnId === id) setCurrentTurnId(null)
  }

  const togglePass = (id: string, passIndex: number) => {
    setCombatants((prev) => prev.map((combatant) => {
      if (combatant.id !== id) return combatant
      const completed = new Set(combatant.passesCompleted)
      if (completed.has(passIndex)) completed.delete(passIndex)
      else completed.add(passIndex)
      return { ...combatant, passesCompleted: Array.from(completed) }
    }))
  }

  const nextTurn = () => {
    if (sortedCombatants.length === 0) return
    const nextIndex = (currentIndex + 1) % sortedCombatants.length
    setCurrentTurnId(sortedCombatants[nextIndex]?.id ?? null)
  }

  const endRound = () => {
    setCombatants((prev) => prev.map((combatant) => ({ ...combatant, passesCompleted: [] })))
    setCurrentTurnId(sortedCombatants[0]?.id ?? null)
    setRound((prev) => prev + 1)
  }

  return {
    sortedCombatants,
    round,
    currentTurnId,
    addCombatant,
    removeCombatant,
    togglePass,
    nextTurn,
    endRound,
  }
}
