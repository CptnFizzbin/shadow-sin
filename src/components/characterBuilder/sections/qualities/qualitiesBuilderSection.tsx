import type { FC } from "react"

import { BuilderSection } from "#/components/characterBuilder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import { QualitiesSection } from "#/components/characterBuilder/sections/qualities/qualitiesSection.tsx"
import { useQualitiesAlerts } from "#/components/characterBuilder/sections/qualities/useQualitiesAlerts.ts"

export const QualitiesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.qualities} alerts={useQualitiesAlerts()}>
      <QualitiesSection />
    </BuilderSection>
  )
}
