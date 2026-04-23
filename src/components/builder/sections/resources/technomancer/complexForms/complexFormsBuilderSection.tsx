import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import {
  ComplexFormsList,
} from "#/components/builder/sections/resources/technomancer/complexForms/complexFormsList.tsx"
import {
  useComplexFormsAlerts,
} from "#/components/builder/sections/resources/technomancer/complexForms/useComplexFormsAlerts.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { isTechnomancer } from "#/components/character/technomancer/technomancerUtils.ts"

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
