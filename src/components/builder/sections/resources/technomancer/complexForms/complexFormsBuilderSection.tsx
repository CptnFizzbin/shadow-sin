import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import {
  selectComplexFormsAlerts,
} from "#/hooks/builder/sections/resources/technomancer/complexForms/useComplexFormsAlerts.ts"
import { useRunnerSelector, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

import {
  ComplexFormsList,
} from "./complexFormsList.tsx"

export const ComplexFormsBuilderSection: FC = () => {
  const awakeningType = useRunnerStoreSelector((sheet) => sheet.biology.awakening)
  const alerts = useRunnerSelector(selectComplexFormsAlerts)

  if (!isTechnomancer(awakeningType)) return null

  return (
    <BuilderSection id={BuilderSectionId.complexForms} alerts={alerts}>
      <ComplexFormsList />
    </BuilderSection>
  )
}
