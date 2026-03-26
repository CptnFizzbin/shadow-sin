import { useStore } from "@tanstack/react-store"
import { produce } from "immer"

import { useCharacterBuilderStoreContext } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { LifestyleType } from "#/lib/system/LifestyleType.ts"

export const useBuilderLifestyleApi = () => {
  const store = useCharacterBuilderStoreContext()
  const lifestyle = useStore(store, (state) => state.lifestyle)
  const lifestyleMonths = useStore(store, (state) => state.lifestyleMonths)

  return {
    lifestyle,
    lifestyleMonths,

    setLifestyle(newLifestyle: LifestyleType) {
      store.setState(produce((draft) => {
        draft.lifestyle = newLifestyle
      }))
    },

    setLifestyleMonths(months: number) {
      store.setState(produce((draft) => {
        draft.lifestyleMonths = months
      }))
    },
  }
}
