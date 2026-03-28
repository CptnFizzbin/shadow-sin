export interface DiceResultsInfo {
  values: number[] // 1-6 or 0 for unrolled
  isRolling: boolean
  hits?: number
  isGlitch?: boolean | "crtical"
}
