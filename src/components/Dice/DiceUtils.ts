import type { CSSProperties } from "react"

export const getDiceOffset = (isRolling: boolean): CSSProperties => {
  const rotate = isRolling ? randomIntInRange(-45, 45) : 0
  const translateX = isRolling ? randomIntInRange(-2, 2) : 1
  const translateY = isRolling ? randomIntInRange(-2, 2) : 1

  return {
    transition: "rotate 100ms, transform 100ms",
    rotate: `${rotate}deg`,
    transform: `translate(${translateX}px, ${translateY}px)`,
  }
}

export const rollD6 = (): number => {
  return randomIntInRange(1, 6)
}

const randomIntInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
