import { useSelector } from "@tanstack/react-store"

import { useAttr } from "#/components/character/attributes/useAttr.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"

import { selectAllComplexForms } from "./complexFormsSelectors.ts"
import { useComplexFormsStore } from "./useComplexFormsStore.ts"

export const useComplexForms = () => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const complexFormsStore = useComplexFormsStore()
  const complexForms = useSelector(complexFormsStore, selectAllComplexForms)

  if (awakeningType !== AwakeningType.Technomancer) {
    return []
  }

  return complexForms
}

export const useMaxComplexForms = () => {
  return useAttr(AttributeKey.logic) * 2
}
