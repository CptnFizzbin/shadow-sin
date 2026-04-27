import type { CSSProperties } from "react"

import { NumberUtils } from "#/lib/numberUtils.ts"

export const getDiceOffset = (isRolling: boolean): CSSProperties => {
  const rotate = isRolling ? NumberUtils.randomIntInRange(-45, 45) : 0
  const translateX = isRolling ? NumberUtils.randomIntInRange(-2, 2) : 1
  const translateY = isRolling ? NumberUtils.randomIntInRange(-2, 2) : 1

  return {
    rotate: `${rotate}deg`,
    transform: `translate(${translateX}px, ${translateY}px)`,
  }
}
