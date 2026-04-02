import type { FC } from "react"

import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"
import {
  ComplexFormsList,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/ComplexForms/ComplexFormsList.tsx"
import {
  useComplexFormsAlerts,
} from '#/components/CharacterBuilder/Sections/Resources/Technomancer/ComplexForms/use-complex-forms-alerts.ts"

export const ComplexFormsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.complexForms} alerts={useComplexFormsAlerts()}>
      <ComplexFormsList />
    </BuilderSection>
  )
}
