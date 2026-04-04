import { sort } from "fast-sort"
import { useCallback, useState } from "react"

import type { DiceResultsInfo } from "#/components/Dice/dice-results-info.tsx"
import { rollD6 } from "#/components/Dice/dice-utils.ts"

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
  const hits = values.filter((value) => value >= 5).length
  const ones = values.filter((value) => value === 1).length
  const isGlitch = ones > numDice / 2
  const isCriticalGlitch = isGlitch && hits === 0

  const diceResult: DiceResultsInfo = {
    values: sort(values).by({ asc: (value) => value }),
    isRolling: isRolling,
    hits: hits,
    isGlitch: isCriticalGlitch ? "crtical" : isGlitch,
  }

  return [diceResult, rollDice]
}

function padArray<TData>(arr: TData[], len: number, fill: TData): TData[] {
  return arr.concat(Array(len).fill(fill)).slice(0, len)
}
