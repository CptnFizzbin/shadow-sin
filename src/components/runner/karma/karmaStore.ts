import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { addKarma, spendKarma } from "#/stores/runner/karma/karmaSlice.actions.ts"
import { karmaReducer } from "#/stores/runner/karma/karmaSlice.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export type KarmaState = RunnerData["karma"]

export class KarmaStore extends StoreSlice<KarmaState> {
  /** @deprecated Dispatch `addKarma` from `#/stores/runner/karma/karmaSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  addKarma(amount: number) {
    this.set((prev) => karmaReducer(prev, addKarma(amount)))
  }

  /** @deprecated Dispatch `spendKarma` from `#/stores/runner/karma/karmaSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  spendKarma(amount: number) {
    this.set((prev) => karmaReducer(prev, spendKarma(amount)))
  }
}
