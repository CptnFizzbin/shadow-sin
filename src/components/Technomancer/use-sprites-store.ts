import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/character-sheet-provider.tsx"
import { createSliceAtom } from "#/integrations/tanstack-store/atom-utils.ts"
import { StoreSlice } from "#/integrations/tanstack-store/store-slice.ts"
import type { CharacterSheet } from "#/lib/system/character-sheet.ts"
import type { SpriteData } from "#/lib/system/magic/sprite-data.ts"

export type SpritesStoreState = CharacterSheet["sprites"]

export class SpritesStore extends StoreSlice<SpritesStoreState> {
  setState(stateOrUpdater: SpritesStoreState | ((prev: SpritesStoreState) => SpritesStoreState)) {
    this.set(stateOrUpdater)
  }

  add(sprite: SpriteData): void {
    this.set((prev) => [...prev, sprite])
  }

  update(sprite: SpriteData): void {
    this.set((prev) => prev.map((s) => s.id === sprite.id ? sprite : s))
  }

  remove(spriteId: string): void {
    this.set((prev) => prev.filter((s) => s.id !== spriteId))
  }
}

export const useSpritesStore = (): SpritesStore => {
  const store = useCharacterSheetContext()

  return useMemo((): SpritesStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.sprites,
      (root, sprites) => produce(root, (draft) => { draft.sprites = sprites }),
    )

    return new SpritesStore(atom)
  }, [store])
}
