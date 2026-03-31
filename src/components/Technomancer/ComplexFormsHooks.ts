import { useStore } from "@tanstack/react-store"

import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import { useAttr } from "#/components/Character/CharacterUtils.ts"
import { useComplexFormsStore } from "#/components/Technomancer/UseComplexFormsStore.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"

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
