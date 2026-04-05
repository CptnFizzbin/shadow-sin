import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export class EdgeStore extends StoreSlice<CharacterSheet> {
  get current(): number {
    return this.state.edge.current
  }

  get max(): number {
    return this.state.attributes[AttributeKey.edge]
  }

  spend(): void {
    this.set(
      produce((sheet) => {
        sheet.edge.current = Math.max(0, sheet.edge.current - 1)
      }),
    )
  }

  recharge(): void {
    this.set(
      produce((sheet) => {
        const edgeMax = sheet.attributes[AttributeKey.edge]
        sheet.edge.current = Math.min(sheet.edge.current + 1, edgeMax)
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

export const useEdgeStore = (): EdgeStore => {
  const sheetStore = useCharacterSheetContext()
  return useMemo(() => new EdgeStore(sheetStore), [sheetStore])
}
