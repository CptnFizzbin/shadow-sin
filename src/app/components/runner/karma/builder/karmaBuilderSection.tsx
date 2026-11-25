import type { FC } from "react"

import { BuilderSection } from "#app/components/builder/builderSection.tsx"
import { KarmaSection } from "#app/components/runner/karma/viewer/karmaSection.tsx"
import { BuilderSectionId } from "#state/builder/builderSectionId.ts"

export const KarmaBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.karma}>
      <KarmaSection />
    </BuilderSection>
  )
}
