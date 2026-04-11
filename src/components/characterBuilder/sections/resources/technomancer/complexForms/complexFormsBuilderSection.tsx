import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { BuilderSection } from "#/components/characterBuilder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import {
  ComplexFormsList,
} from "#/components/characterBuilder/sections/resources/technomancer/complexForms/complexFormsList.tsx"
import {
  useComplexFormsAlerts,
} from "#/components/characterBuilder/sections/resources/technomancer/complexForms/useComplexFormsAlerts.ts"
import { isTechnomancer } from "#/components/technomancer/technomancerUtils.ts"

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
