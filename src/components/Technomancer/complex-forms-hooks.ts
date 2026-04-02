import { useStore } from "@tanstack/react-store"

import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import { useAttr } from "#/components/Character/character-utils.ts"
import { useComplexFormsStore } from "#/components/Technomancer/use-complex-forms-store.ts"
import { AttributeKey } from "#/lib/system/attribute-key.ts"
import { AwakeningType } from "#/lib/system/awakening-type.ts"

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
