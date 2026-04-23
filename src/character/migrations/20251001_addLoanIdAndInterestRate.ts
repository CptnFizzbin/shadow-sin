import { produce } from "immer"

import type { CharacterMigration } from "#/character/characterMigration.ts"

interface LoanData {
  id?: string
  lender: string
  amount: number
  interestRate?: number
  notes?: string
}

const migration: CharacterMigration<{
  nuyen?: {
    current?: number
    loans?: LoanData[]
  }
}> = {
  id: "20251001",
  up: produce((character) => {
    character.nuyen ??= {}
    character.nuyen.current ??= 0
    character.nuyen.loans = (character.nuyen.loans ?? []).map((loan) => ({
      id: loan.id ?? crypto.randomUUID(),
      lender: loan.lender,
      amount: loan.amount,
      interestRate: loan.interestRate ?? 0,
      notes: loan.notes,
    }))
  }),
}

export default migration
