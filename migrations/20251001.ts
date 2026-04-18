import { produce } from "immer"

import type { CharacterMigration } from "#/lib/storage/characters/characterMigration.ts"

interface LoanBefore {
  lender: string
  amount: number
  notes?: string
}

interface LoanAfter {
  id: string
  lender: string
  amount: number
  interestRate: number
  notes?: string
}

const migration: CharacterMigration<{
  nuyen?: {
    current?: number
    loans?: LoanBefore[]
  }
}> = {
  id: "20251001",
  checkApplied: (character) => {
    const chars = character as { nuyen?: { loans?: Array<Record<string, unknown>> } }
    return (chars.nuyen?.loans ?? []).every((loan) => "id" in loan)
  },
  up: (character) =>
    produce(character as unknown as { nuyen: { current: number; loans: LoanAfter[] } }, (draft) => {
      const nuyen = (draft as unknown as { nuyen?: { current?: number; loans?: LoanBefore[] } }).nuyen
      if (nuyen?.loans) {
        draft.nuyen = {
          current: nuyen.current ?? 0,
          loans: nuyen.loans.map((loan) => ({
            id: crypto.randomUUID(),
            lender: loan.lender,
            amount: loan.amount,
            interestRate: 0,
            notes: loan.notes,
          })),
        }
      } else {
        draft.nuyen = {
          current: nuyen?.current ?? 0,
          loans: [],
        }
      }
    }),
}

export default migration
