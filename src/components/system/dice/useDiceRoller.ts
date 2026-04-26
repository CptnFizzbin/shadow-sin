import { sort } from "fast-sort"
import { useCallback, useState } from "react"

import type { DiceResultsInfo } from "#/components/system/dice/diceResultsInfo.tsx"
import { rollD6 } from "#/components/system/dice/diceUtils.ts"
import {
  countHits,
  isCriticalGlitch as checkCriticalGlitch,
  isGlitch as checkGlitch,
} from "#/system/dice/diceRoll.ts"

export function useDiceRoller(numDice: number, rollingTime: number = 0): [results: DiceResultsInfo, rollDice: () => void] {
  const [diceValues, setDiceValues] = useState<number[]>(padArray([], numDice, 0))
  const [isRolling, setIsRolling] = useState(false)

  const rollDice = useCallback(() => {
    const nextValue = Array.from({ length: numDice }, () => rollD6())
    if (rollingTime >= 1) {
      setIsRolling(true)
      setTimeout(() => {
        setDiceValues(nextValue)
        setIsRolling(false)
      }, rollingTime)
    } else {
      setIsRolling(false)
      setDiceValues(nextValue)
    }
  }, [numDice, rollingTime])

  const values = padArray(diceValues, numDice, 0)
  const hits = countHits(values)
  const glitch = checkGlitch(values)
  const criticalGlitch = checkCriticalGlitch(values)

  const diceResult: DiceResultsInfo = {
    values: sort(values).by({ asc: (value) => value }),
    isRolling: isRolling,
    hits: hits,
    isGlitch: criticalGlitch ? "crtical" : glitch,
  }

  return [diceResult, rollDice]
}

function padArray<TData>(arr: TData[], len: number, fill: TData): TData[] {
  return arr.concat(Array(len).fill(fill)).slice(0, len)
}
