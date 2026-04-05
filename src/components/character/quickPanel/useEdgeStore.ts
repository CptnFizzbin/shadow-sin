import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheet, useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export class EdgeStore extends StoreSlice<CharacterSheet> {
  setCurrent(value: number): void {
    this.set(
      produce((sheet) => {
        const edgeMax = sheet.attributes[AttributeKey.edge]
        sheet.edge.current = Math.max(0, Math.min(value, edgeMax))
      }),
    )
  }

  burn(): void {
    this.set(
      produce((sheet) => {
        const newMax = Math.max(1, sheet.attributes[AttributeKey.edge] - 1)
        sheet.attributes[AttributeKey.edge] = newMax
        sheet.edge.current = 0
      }),
    )
  }
}

export const useEdgeStore = () => {
  const sheetStore = useCharacterSheetContext()
  const store = useMemo(() => new EdgeStore(sheetStore), [sheetStore])

  const current = useCharacterSheet((sheet) => sheet.edge.current)
  const max = useCharacterSheet((sheet) => sheet.attributes[AttributeKey.edge])

  return {
    current,
    max,
    setCurrent: (value: number) => store.setCurrent(value),
    burn: () => store.burn(),
  }
}
