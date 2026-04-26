import type { CSSProperties } from "react"

export { rollD6 } from "#/system/dice/diceRoll.ts"

export const getDiceOffset = (isRolling: boolean): CSSProperties => {
  const rotate = isRolling ? randomIntInRange(-45, 45) : 0
  const translateX = isRolling ? randomIntInRange(-2, 2) : 1
  const translateY = isRolling ? randomIntInRange(-2, 2) : 1

  return {
    rotate: `${rotate}deg`,
    transform: `translate(${translateX}px, ${translateY}px)`,
  }
}

const randomIntInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
