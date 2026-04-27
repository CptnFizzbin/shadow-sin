import { produce } from "immer"

import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import type { ManualStatus } from "#/system/manualStatus.ts"

export interface ManualStatusState {
  entries: ManualStatus[]
}

export class ManualStatusStore extends StoreSlice<ManualStatusState> {
  add(status: ManualStatus): void {
    this.set(produce((state) => {
      state.entries.push(status)
    }))
  }

  remove(id: string): void {
    this.set(produce((state) => {
      state.entries = state.entries.filter((e) => e.id !== id)
    }))
  }

  clear(): void {
    this.set(produce((state) => {
      state.entries = []
    }))
  }
}
