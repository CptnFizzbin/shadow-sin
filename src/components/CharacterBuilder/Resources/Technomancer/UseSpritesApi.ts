import { useStore } from "@tanstack/react-store"
import { produce } from "immer"

import { useCharacterBuilderStoreContext } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { SpriteFormState } from "#/components/CharacterBuilder/Resources/AwakenedFormState.ts"

export const useBuilderSpritesApi = () => {
  const store = useCharacterBuilderStoreContext()
  const sprites = useStore(store, (state) => state.awakened.sprites)

  return {
    sprites,

    addSprite(sprite: SpriteFormState) {
      store.setState(produce((draft) => {
        draft.awakened.sprites.push(sprite)
      }))
    },

    updateSprite(sprite: SpriteFormState) {
      store.setState(produce((draft) => {
        draft.awakened.sprites = draft.awakened.sprites.map((s) =>
          s.id === sprite.id ? sprite : s,
        )
      }))
    },

    removeSprite(spriteId: string) {
      store.setState(produce((draft) => {
        draft.awakened.sprites = draft.awakened.sprites.filter(
          (s) => s.id !== spriteId,
        )
      }))
    },
  }
}
