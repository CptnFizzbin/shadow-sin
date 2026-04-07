import { produce } from "immer"

import type { BaseCharacterMetadata, CharacterMigration } from "#/lib/storage/characters/characterMigration.ts"
import type { Character_V0_2_0 } from "#/lib/storage/characters/migrations/v020.ts"

interface Loan_V0_2_0 {
  lender: string
  amount: number
  notes?: string
}

interface Loan_V0_3_0 {
  id: string
  lender: string
  amount: number
  interestRate: number
  notes?: string
}

export interface Character_V0_3_0 extends BaseCharacterMetadata {
  version: string
  nuyen: {
    current: number
    loans: Loan_V0_3_0[]
  }
}

const migration: CharacterMigration<Character_V0_2_0, Character_V0_3_0> = {
  version: "0.3.0",
  up: (character) =>
    produce(character as unknown as Character_V0_3_0, (draft) => {
      const nuyen = (draft as unknown as { nuyen?: { current?: number, loans?: Loan_V0_2_0[] } }).nuyen
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
