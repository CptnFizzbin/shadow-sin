import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstack-store/AtomUtils.ts"
import { StoreSlice } from "#/integrations/tanstack-store/StoreSlice.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

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
