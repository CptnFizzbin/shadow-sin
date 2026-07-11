import { useSelector } from "@tanstack/react-store"

import { useAttr } from "#/components/runner/runnerUtils.ts"
import { useRunnerData } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"

import { selectAllComplexForms } from "./complexFormsSelectors.ts"
import { useComplexFormsStore } from "./useComplexFormsStore.ts"

export const useComplexForms = () => {
  const awakeningType = useRunnerData((sheet) => sheet.biology.awakening)
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
