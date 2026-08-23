import type { UUID } from "#/lib/uuidUtils.ts"

export interface LoanData {
  id: UUID
  lender: string
  amount: number
  interestRate: number
  notes?: string
}

export function calculateMonthlyInterest(loan: LoanData): number {
  if (loan.interestRate <= 0) return 0
  return Math.ceil(loan.amount * loan.interestRate / 100)
}
