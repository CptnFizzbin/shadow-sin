import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { BiologyStore } from "./biologyStore.ts"

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
