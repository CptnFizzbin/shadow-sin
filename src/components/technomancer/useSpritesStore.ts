import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import type { SpriteData } from "#/lib/system/magic/spriteData.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

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

  save(sprite: SpriteData): void {
    if (!sprite.id || sprite.id === NullUuid) {
      this.add({ ...sprite, id: crypto.randomUUID() })
    } else {
      this.update(sprite)
    }
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
