import type { UUID } from "node:crypto"

import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import type { LoanData } from "#/lib/system/loanData.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

type NuyenState = CharacterSheet["nuyen"]

export class NuyenStore extends StoreSlice<NuyenState> {
  setAmount(amount: number) {
    this.set((prev) => ({ ...prev, current: amount }))
  }

  deposit(amount: number) {
    this.set((prev) => ({ ...prev, current: prev.current + amount }))
  }

  withdraw(amount: number) {
    this.set((prev) => ({ ...prev, current: prev.current - amount }))
  }

  addLoan(loan: Omit<LoanData, "id">): LoanData {
    const newLoan: LoanData = { ...loan, id: crypto.randomUUID() }
    this.set((prev) => ({ ...prev, loans: [...prev.loans, newLoan] }))
    return newLoan
  }

  saveLoan(loan: LoanData): LoanData {
    if (!loan.id || loan.id === NullUuid) {
      return this.addLoan(loan)
    }
    this.set((prev) =>
      produce(prev, (draft) => {
        const index = draft.loans.findIndex((l) => l.id === loan.id)
        if (index >= 0) {
          draft.loans[index] = loan
        }
      }),
    )
    return loan
  }

  removeLoan(loanId: UUID) {
    this.set((prev) => ({ ...prev, loans: prev.loans.filter((l) => l.id !== loanId) }))
  }

  payoffLoan(loanId: UUID) {
    const loan = this.state.loans.find((l) => l.id === loanId)
    if (!loan) return
    this.set((prev) => ({
      ...prev,
      current: prev.current - loan.amount,
      loans: prev.loans.filter((l) => l.id !== loanId),
    }))
  }

  endOfMonth() {
    this.set((prev) =>
      produce(prev, (draft) => {
        for (const loan of draft.loans) {
          if (loan.interestRate > 0) {
            loan.amount = Math.ceil(loan.amount * (1 + loan.interestRate / 100))
          }
        }
      }),
    )
  }
}

export function useNuyenStore() {
  const store = useCharacterSheetContext()

  return useMemo((): NuyenStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.nuyen,
      (root, nuyen) => produce(root, (draft) => { draft.nuyen = nuyen }),
    )
    return new NuyenStore(atom)
  }, [store])
}
