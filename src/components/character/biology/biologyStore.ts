import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

export type BiologyState = CharacterSheet["biology"]

export class BiologyStore extends StoreSlice<BiologyState> {
}
