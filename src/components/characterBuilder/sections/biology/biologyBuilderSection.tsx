import type { FC } from "react"

import { BiologySection } from "#/components/characterBuilder/sections/biology/biologySection.tsx"
import { useBiologyAlerts } from "#/components/characterBuilder/sections/biology/useBiologyAlerts.ts"
import { BuilderSection } from "#/components/characterBuilder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"

export const BiologyBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.biology} alerts={useBiologyAlerts()}>
      <BiologySection />
    </BuilderSection>
  )
}
