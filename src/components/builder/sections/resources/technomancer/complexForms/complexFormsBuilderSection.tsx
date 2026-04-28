import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { isTechnomancer } from "#/components/character/technomancer/technomancerUtils.ts"

import {
  ComplexFormsList,
} from "./complexFormsList.tsx"
import {
  useComplexFormsAlerts,
} from "./useComplexFormsAlerts.ts"

export const ComplexFormsBuilderSection: FC = () => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const alerts = useComplexFormsAlerts()

  if (!isTechnomancer(awakeningType)) return null

  return (
    <BuilderSection id={BuilderSectionId.complexForms} alerts={alerts}>
      <ComplexFormsList />
    </BuilderSection>
  )
}
