import type { FC } from "react"

import { BiologySection } from "#/components/builder/sections/biology/biologySection.tsx"
import { useBiologyAlerts } from "#/components/builder/sections/biology/useBiologyAlerts.ts"
import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"

export const BiologyBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.biology} alerts={useBiologyAlerts()}>
      <BiologySection />
    </BuilderSection>
  )
}
