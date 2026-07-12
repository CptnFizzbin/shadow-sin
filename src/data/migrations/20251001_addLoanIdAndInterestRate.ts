import { produce } from "immer"

<<<<<<<< HEAD:src/data/migrations/20251001_addLoanIdAndInterestRate.ts
import type { CharacterMigration } from "#/data/characterMigration.ts"
========
import type { CharacterMigration } from "#/runner/characterMigration.ts"
>>>>>>>> shadowrun-4e:src/runner/migrations/20251001_addLoanIdAndInterestRate.ts

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
