import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { QualitiesSection } from "#/components/builder/sections/qualities/qualitiesSection.tsx"
import { useQualitiesAlerts } from "#/components/builder/sections/qualities/useQualitiesAlerts.ts"

export const QualitiesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.qualities} alerts={useQualitiesAlerts()}>
      <QualitiesSection />
    </BuilderSection>
  )
}
