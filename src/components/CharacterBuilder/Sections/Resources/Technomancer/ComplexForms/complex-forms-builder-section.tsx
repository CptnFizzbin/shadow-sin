import type { FC } from "react"

import { ComplexFormsList } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/ComplexForms/complex-forms-list.tsx"
import { useComplexFormsAlerts } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/use-complex-forms-alerts.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/builder-section.tsx"

export const ComplexFormsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.complexForms} alerts={useComplexFormsAlerts()}>
      <ComplexFormsList />
    </BuilderSection>
  )
}
