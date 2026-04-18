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

interface Input {
  nuyen?: {
    current?: number
    loans?: LoanBefore[]
  }
}

interface Output {
  nuyen: {
    current: number
    loans: LoanAfter[]
  }
}

const migration: CharacterMigration<Input, Output> = {
  id: "20251001",
  checkApplied: (character) => {
    const characterData = character as { nuyen?: { loans?: Array<Record<string, unknown>> } }
    return (characterData.nuyen?.loans ?? []).every((loan) => "id" in loan)
  },
  up: (character) => ({
    ...character,
    nuyen: {
      current: character.nuyen?.current ?? 0,
      loans: (character.nuyen?.loans ?? []).map((loan) => ({
        id: crypto.randomUUID(),
        lender: loan.lender,
        amount: loan.amount,
        interestRate: 0,
        notes: loan.notes,
      })),
    },
  }),
}

export default migration
