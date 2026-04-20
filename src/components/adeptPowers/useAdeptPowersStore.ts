import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import type { AdeptPowerData } from "#/system/magic/adeptPowerData.ts"

export type AdeptPowersStoreState = CharacterSheet["adeptPowers"]

export class AdeptPowersStore extends StoreSlice<AdeptPowersStoreState> {
  setState(stateOrUpdater: AdeptPowersStoreState | ((prev: AdeptPowersStoreState) => AdeptPowersStoreState)) {
    this.set(stateOrUpdater)
  }

  add(power: AdeptPowerData): void {
    this.set((prev) => [...prev, power])
  }

  update(power: AdeptPowerData): void {
    this.set((prev) => prev.map((p) => p.id === power.id ? power : p))
  }

  remove(powerId: string): void {
    this.set((prev) => prev.filter((p) => p.id !== powerId))
  }

  save(power: AdeptPowerData): void {
    if (!power.id || power.id === NullUuid) {
      this.add({ ...power, id: crypto.randomUUID() })
    } else {
      this.update(power)
    }
  }
}

export const useAdeptPowersStore = (): AdeptPowersStore => {
  const store = useCharacterSheetContext()

  return useMemo((): AdeptPowersStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.adeptPowers,
      (root, adeptPowers) => produce(root, (draft) => { draft.adeptPowers = adeptPowers }),
    )

    return new AdeptPowersStore(atom)
  }, [store])
}
