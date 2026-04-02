import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/character-sheet-provider.tsx"
import { createSliceAtom } from "#/integrations/tanstack-store/atom-utils.ts"
import { StoreSlice } from "#/integrations/tanstack-store/store-slice.ts"
import type { CharacterSheet } from "#/lib/system/character-sheet.ts"

export type BiologyState = CharacterSheet["biology"]

export class BiologyStore extends StoreSlice<BiologyState> {
}

export const useBiologyStore = (): BiologyStore => {
  const sheetStore = useCharacterSheetContext()

  return useMemo(() => {
    return new BiologyStore(createSliceAtom(
      sheetStore,
      (sheet) => sheet.biology,
      (sheet, biology) => ({ ...sheet, biology }),
    ))
  }, [sheetStore])
}
