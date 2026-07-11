import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export type BiologyState = RunnerData["biology"]

export class BiologyStore extends StoreSlice<BiologyState> {
}
