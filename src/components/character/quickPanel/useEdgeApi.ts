import { produce } from "immer"

import { useCharacterSheet, useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { AttributeKey } from "#/lib/system/attributeKey.ts"

export const useEdgeApi = () => {
  const sheetStore = useCharacterSheetContext()
  const edgeCurrent = useCharacterSheet((sheet) => sheet.edge.current)
  const edgeMax = useCharacterSheet((sheet) => sheet.attributes[AttributeKey.edge])

  const spend = () => {
    sheetStore.setState(
      produce((sheet) => {
        sheet.edge.current = Math.max(0, sheet.edge.current - 1)
      }),
    )
  }

  const recharge = () => {
    sheetStore.setState(
      produce((sheet) => {
        const currentMax = sheet.attributes[AttributeKey.edge]
        sheet.edge.current = Math.min(sheet.edge.current + 1, currentMax)
      }),
    )
  }

  const burn = () => {
    sheetStore.setState(
      produce((sheet) => {
        const newMax = Math.max(1, sheet.attributes[AttributeKey.edge] - 1)
        sheet.attributes[AttributeKey.edge] = newMax
        sheet.edge.current = 0
      }),
    )
  }

  return {
    current: edgeCurrent,
    max: edgeMax,
    spend,
    recharge,
    burn,
  }
}
