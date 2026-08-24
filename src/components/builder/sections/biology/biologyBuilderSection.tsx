import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { selectBiologyAlerts } from "#/hooks/builder/sections/biology/useBiologyAlerts.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

import { BiologySection } from "./biologySection.tsx"

export const BiologyBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.biology} alerts={useRunnerSelector(selectBiologyAlerts)}>
      <BiologySection />
    </BuilderSection>
  )
}
