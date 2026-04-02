export interface WeaponRangeInfo {
  usesStrength?: boolean
  minRange?: number

  // distances in meters, or if `useStrength` is true, strength muiltiplier
  short: number
  medium: number
  long: number
  extreme: number
}
