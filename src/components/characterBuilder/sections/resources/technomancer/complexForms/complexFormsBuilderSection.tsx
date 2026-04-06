import type { FC } from "react"

import { BuilderSection } from "#/components/characterBuilder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import {
  ComplexFormsList,
} from "#/components/characterBuilder/sections/resources/technomancer/complexForms/complexFormsList.tsx"
import {
  useComplexFormsAlerts,
} from "#/components/characterBuilder/sections/resources/technomancer/complexForms/useComplexFormsAlerts.ts"

export const ComplexFormsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.complexForms} alerts={useComplexFormsAlerts()}>
      <ComplexFormsList />
    </BuilderSection>
  )
}
