import type { FC } from "react"

import { BuilderSection } from "#/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { useBiologyAlerts } from "#/hooks/builder/sections/biology/useBiologyAlerts.ts"

import { BiologySection } from "./biologySection.tsx"

export const BiologyBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.biology} alerts={useBiologyAlerts()}>
      <BiologySection />
    </BuilderSection>
  )
}
