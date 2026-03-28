import type { FC } from "react"

import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import { QualitiesSection } from "#/components/CharacterBuilder/Sections/Qualities/QualitiesSection.tsx"
import { useQualitiesAlerts } from "#/components/CharacterBuilder/Sections/Qualities/UseQualitiesAlerts.ts"

export const QualitiesBuilderSection: FC = () => {
  return (
    <BuilderSection title="Qualities" alerts={useQualitiesAlerts()}>
      <QualitiesSection />
    </BuilderSection>
  )
}
