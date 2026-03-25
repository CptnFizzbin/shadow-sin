export interface BpLineItem {
  label: string
  spent: number
  allowance?: number
  enabled?: boolean
  isOverBudget?: boolean
}
