import { useMemo } from "react"

import { DiceRoller } from "#/system/dice/diceRoller.ts"

export function useDiceRoller(numDice: number): DiceRoller {
  return useMemo(() => new DiceRoller().setPoolSize(numDice), [numDice])
}
