import type { FC } from "react"

import { BuilderSection } from "#/app/components/builder/builderSection.tsx"
import { isTechnomancer } from "#/data/magic/technomancerUtils.ts"
import { BuilderSectionId } from "#/state/builder/builderSectionId.ts"
import {
  useComplexFormsAlerts,
} from "#/state/builder/sections/resources/technomancer/complexForms/useComplexFormsAlerts.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { ComplexFormsList } from "./complexFormsList.tsx"

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
