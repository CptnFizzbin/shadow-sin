import { useCallback, useState } from "react"

export function useDiceRoller(numDice: number) {
  const [diceValues, setDiceValues] = useState<number[]>(padArray([], numDice, 0))

  const rollDice = useCallback(() => {
    setDiceValues(Array.from({ length: numDice }, () => Math.ceil(Math.random() * 6)))
  }, [numDice])

  const values = padArray(diceValues, numDice, 0)
  const hits = values.filter((value) => value >= 5).length
  const ones = values.filter((value) => value === 1).length
  const isGlitch = ones > numDice / 2
  const isCriticalGlitch = isGlitch && hits === 0

  const diceResult = {
    values: values,
    hits,
    isGlitch: isCriticalGlitch ? "crtical" : isGlitch,
  }

  return [diceResult, rollDice]
}

function padArray<TData>(arr: TData[], len: number, fill: TData): TData[] {
  return arr.concat(Array(len).fill(fill)).slice(0, len)
}
