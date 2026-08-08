import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const VERSION = 3

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
  version: VERSION,
  up: (character) => {
    return produce(character, (draft) => {
      draft.nuyen ??= {}
      draft.nuyen.current ??= 0
      draft.nuyen.loans = (draft.nuyen.loans ?? []).map((loan) => ({
        id: loan.id ?? crypto.randomUUID(),
        lender: loan.lender,
        amount: loan.amount,
        interestRate: loan.interestRate ?? 0,
        notes: loan.notes,
      }))
    })
  },
}

export default migration
