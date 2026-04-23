import { useStore } from "@tanstack/react-store"

import { useAttr } from "#/components/character/characterUtils.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { selectAllComplexForms } from "#/components/character/technomancer/complexFormsSelectors.ts"
import { useComplexFormsStore } from "#/components/character/technomancer/useComplexFormsStore.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"

export const useComplexForms = () => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const complexFormsStore = useComplexFormsStore()
  const complexForms = useStore(complexFormsStore, selectAllComplexForms)

  if (awakeningType !== AwakeningType.Technomancer) {
    return []
  }

  return complexForms
}

export const useMaxComplexForms = () => {
  return useAttr(AttributeKey.logic) * 2
}
