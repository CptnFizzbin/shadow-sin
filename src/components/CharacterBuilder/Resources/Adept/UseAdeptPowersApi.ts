import { useStore } from "@tanstack/react-store"
import { produce } from "immer"

import { useCharacterBuilderStoreContext } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { AdeptPowerData } from "#/lib/system/magic/adeptPowerData.ts"

export const useBuilderAdeptPowersApi = () => {
  const store = useCharacterBuilderStoreContext()
  const adeptPowers = useStore(store, (state) => state.awakened.adeptPowers ?? [])

  return {
    adeptPowers,

    addPower(power: AdeptPowerData) {
      store.setState(produce((draft) => {
        draft.awakened.adeptPowers.push({ ...power, id: crypto.randomUUID() })
      }))
    },

    updatePower(power: AdeptPowerData) {
      store.setState(produce((draft) => {
        draft.awakened.adeptPowers = draft.awakened.adeptPowers.map((p) =>
          p.id === power.id ? power : p,
        )
      }))
    },

    removePower(power: AdeptPowerData) {
      store.setState(produce((draft) => {
        draft.awakened.adeptPowers = draft.awakened.adeptPowers.filter(
          (p) => p.id !== power.id,
        )
      }))
    },
  }
}
