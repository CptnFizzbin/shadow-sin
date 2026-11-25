import type { FC } from "react"

import { BuilderSection } from "#/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { KarmaSection } from "#/components/runner/karma/viewer/karmaSection.tsx"

export const KarmaBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.karma}>
      <KarmaSection />
    </BuilderSection>
  )
}
