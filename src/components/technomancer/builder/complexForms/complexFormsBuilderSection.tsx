import type { FC } from "react"

import { BuilderSection } from "#/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { isTechnomancer } from "#/components/technomancer/viewer/technomancerUtils.ts"
import {
  useComplexFormsAlerts,
} from "#/hooks/builder/sections/resources/technomancer/complexForms/useComplexFormsAlerts.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import {
  ComplexFormsList,
} from "./complexFormsList.tsx"

export const ComplexFormsBuilderSection: FC = () => {
  const awakeningType = useRunnerSelector(BiologySelectors.selectAwakening)
  const alerts = useComplexFormsAlerts()

  if (!isTechnomancer(awakeningType)) return null

  return (
    <BuilderSection id={BuilderSectionId.complexForms} alerts={alerts}>
      <ComplexFormsList />
    </BuilderSection>
  )
}
