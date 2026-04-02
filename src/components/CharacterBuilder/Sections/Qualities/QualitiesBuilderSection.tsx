import type { FC } from "react"

import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"
import { QualitiesSection } from "#/components/CharacterBuilder/Sections/Qualities/QualitiesSection.tsx"
import { useQualitiesAlerts } from "#/components/CharacterBuilder/Sections/Qualities/UseQualitiesAlerts.ts"

export const QualitiesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.qualities} alerts={useQualitiesAlerts()}>
      <QualitiesSection />
    </BuilderSection>
  )
}
