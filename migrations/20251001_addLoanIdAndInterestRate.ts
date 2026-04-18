import { produce } from "immer"

import type { CharacterMigration } from "#/lib/storage/characters/characterMigration.ts"

interface LoanData {
  id?: string
  lender: string
  amount: number
  interestRate?: number
  notes?: string
}

interface InputCharacterState {
  nuyen?: {
    current?: number
    loans?: LoanData[]
  }
}

const migration: CharacterMigration<InputCharacterState> = {
  id: "20251001",
  up: (character) =>
    produce(character, (draft) => {
      draft.nuyen = {
        current: draft.nuyen?.current ?? 0,
        loans: (draft.nuyen?.loans ?? []).map((loan) => ({
          id: loan.id ?? crypto.randomUUID(),
          lender: loan.lender,
          amount: loan.amount,
          interestRate: loan.interestRate ?? 0,
          notes: loan.notes,
        })),
      }
    }),
}

export default migration
