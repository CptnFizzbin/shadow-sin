import type { UUID } from "node:crypto"

import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

export type KarmaState = CharacterSheet["karma"]

export class KarmaStore extends StoreSlice<KarmaState> {
  addKarma(amount: number) {
    if (amount <= 0) throw new Error(`addKarma requires a positive amount, got ${amount}`)
    this.set((prev) => ({
      ...prev,
      current: prev.current + amount,
      total: prev.total + amount,
      log: [
        ...prev.log,
        {
          id: crypto.randomUUID() as UUID,
          timestamp: new Date().toISOString(),
          amount,
          description: `Added ${amount} karma`,
          source: "addKarma" as const,
        },
      ],
    }))
  }

  spendKarma(amount: number) {
    if (amount <= 0) throw new Error(`spendKarma requires a positive amount, got ${amount}`)
    this.set((prev) => {
      if (amount > prev.current) {
        throw new Error(`Insufficient karma: requested ${amount}, have ${prev.current}`)
      }
      return { ...prev, current: prev.current - amount }
    })
  }
}
