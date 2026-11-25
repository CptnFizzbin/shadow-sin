export interface DieState {
  value: null | number
  isRolling: boolean
}

export interface SettledDieState extends DieState {
  value: number
  isRolling: false
}
