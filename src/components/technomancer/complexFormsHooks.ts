import { useStore } from "@tanstack/react-store"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { useAttr } from "#/components/character/characterUtils.ts"
import { useComplexFormsStore } from "#/components/technomancer/useComplexFormsStore.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"

export const useComplexForms = () => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const complexFormsStore = useComplexFormsStore()
  const complexForms = useStore(complexFormsStore, (state) => state)

  if (awakeningType !== AwakeningType.Technomancer) {
    return []
  }

  return complexForms
}

export const useMaxComplexForms = () => {
  return useAttr(AttributeKey.logic) * 2
}
