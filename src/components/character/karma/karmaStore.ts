import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

export type KarmaState = CharacterSheet["karma"]

export class KarmaStore extends StoreSlice<KarmaState> {
  addKarma(amount: number) {
    this.set((prev) => ({
      ...prev,
      current: prev.current + amount,
      total: prev.total + amount,
    }))
  }

  spendKarma(amount: number) {
    this.set((prev) => ({
      ...prev,
      current: Math.max(0, prev.current - amount),
    }))
  }
}
