import type { FC } from "react"

import { QualitiesSection } from "#/components/CharacterBuilder/Sections/Qualities/qualities-section.tsx"
import { useQualitiesAlerts } from "#/components/CharacterBuilder/Sections/Qualities/use-qualities-alerts.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/builder-section.tsx"

export const QualitiesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.qualities} alerts={useQualitiesAlerts()}>
      <QualitiesSection />
    </BuilderSection>
  )
}
