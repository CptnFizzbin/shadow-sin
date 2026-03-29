import type { BaseAtom } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetContext.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import type { SpriteData } from "#/lib/system/magic/spriteData.ts"

export type SpritesStoreState = CharacterSheet["sprites"]

export interface UseSpritesStore extends BaseAtom<SpritesStoreState> {
  add(sprite: SpriteData): void

  update(sprite: SpriteData): void

  remove(spriteId: string): void

  setState(state: SpritesStoreState): void

  setState(updater: (prev: SpritesStoreState) => SpritesStoreState): void
}

export const useSpritesStore = (): UseSpritesStore => {
  const store = useCharacterSheetContext()

  return useMemo((): UseSpritesStore => {
    const spritesStore = createStore(() => store.state.sprites)

    const toUpdater = <T>(valueOrUpdater: T | ((prev: T) => T)): ((prev: T) => T) =>
      typeof valueOrUpdater === "function"
        ? (valueOrUpdater as (prev: T) => T)
        : () => valueOrUpdater

    return {
      get: () => spritesStore.get(),
      subscribe: (listener) => spritesStore.subscribe(listener),

      setState: (stateOrUpdater) => {
        const updater = toUpdater(stateOrUpdater)
        store.setState(produce((prev) => {
          prev.sprites = updater(prev.sprites)
        }))
      },

      add: (sprite) => {
        store.setState(produce((prev) => {
          prev.sprites.push(sprite)
        }))
      },

      update: (sprite) => {
        store.setState(produce((prev) => {
          prev.sprites = prev.sprites.map((s) => s.id === sprite.id ? sprite : s)
        }))
      },

      remove: (spriteId) => {
        store.setState(produce((prev) => {
          prev.sprites = prev.sprites.filter((s) => s.id !== spriteId)
        }))
      },
    }
  }, [store])
}
