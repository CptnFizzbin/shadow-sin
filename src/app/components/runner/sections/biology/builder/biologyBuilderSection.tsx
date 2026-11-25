import type { FC } from "react"

import { BuilderSection } from "#/app/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#/state/builder/builderSectionId.ts"
import { useBiologyAlerts } from "#/state/builder/sections/biology/useBiologyAlerts.ts"

import { BiologySection } from "./biologySection.tsx"

export const BiologyBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.biology} alerts={useBiologyAlerts()}>
      <BiologySection />
    </BuilderSection>
  )
}
