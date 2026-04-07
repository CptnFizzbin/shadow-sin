import type { UUID } from "node:crypto"

export interface LoanData {
  id: UUID
  lender: string
  amount: number
  interestRate: number
  notes?: string
}
