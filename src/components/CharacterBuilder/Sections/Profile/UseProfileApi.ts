import { useStore } from "@tanstack/react-store"
import { produce } from "immer"

import { useCharacterBuilderStoreContext } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"

export const useBuilderProfileApi = () => {
  const store = useCharacterBuilderStoreContext()
  const name = useStore(store, (state) => state.name)
  const alias = useStore(store, (state) => state.alias)

  return {
    name,
    alias,

    setName(newName: string) {
      store.setState(produce((draft) => {
        draft.name = newName
      }))
    },

    setAlias(newAlias: string) {
      store.setState(produce((draft) => {
        draft.alias = newAlias
      }))
    },
  }
}
