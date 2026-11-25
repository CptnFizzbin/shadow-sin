import type { FC } from "react"

import { BuilderSection } from "#/app/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#/state/builder/builderSectionId.ts"
import { useQualitiesAlerts } from "#/state/builder/sections/qualities/useQualitiesAlerts.ts"

import { QualitiesSection } from "./qualitiesSection.tsx"

export const QualitiesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.qualities} alerts={useQualitiesAlerts()}>
      <QualitiesSection />
    </BuilderSection>
  )
}
