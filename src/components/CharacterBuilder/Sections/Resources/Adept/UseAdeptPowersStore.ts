import type { BaseAtom } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetContext.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import type { AdeptPowerData } from "#/lib/system/magic/adeptPowerData.ts"

export type AdeptPowersStoreState = CharacterSheet["adeptPowers"]

export interface UseAdeptPowersStore extends BaseAtom<AdeptPowersStoreState> {
  add(power: AdeptPowerData): void

  update(power: AdeptPowerData): void

  remove(powerId: string): void

  setState(state: AdeptPowersStoreState): void

  setState(updater: (prev: AdeptPowersStoreState) => AdeptPowersStoreState): void
}

export const useAdeptPowersStore = (): UseAdeptPowersStore => {
  const store = useCharacterSheetContext()

  return useMemo((): UseAdeptPowersStore => {
    const adeptPowersStore = createStore(() => store.state.adeptPowers)

    const toUpdater = <T>(valueOrUpdater: T | ((prev: T) => T)): ((prev: T) => T) =>
      typeof valueOrUpdater === "function"
        ? (valueOrUpdater as (prev: T) => T)
        : () => valueOrUpdater

    return {
      get: () => adeptPowersStore.get(),
      subscribe: (listener) => adeptPowersStore.subscribe(listener),

      setState: (stateOrUpdater) => {
        const updater = toUpdater(stateOrUpdater)
        store.setState(produce((prev) => {
          prev.adeptPowers = updater(prev.adeptPowers)
        }))
      },

      add: (power) => {
        store.setState(produce((prev) => {
          prev.adeptPowers.push(power)
        }))
      },

      update: (power) => {
        store.setState(produce((prev) => {
          prev.adeptPowers = prev.adeptPowers.map((p) => p.id === power.id ? power : p)
        }))
      },

      remove: (powerId) => {
        store.setState(produce((prev) => {
          prev.adeptPowers = prev.adeptPowers.filter((p) => p.id !== powerId)
        }))
      },
    }
  }, [store])
}
