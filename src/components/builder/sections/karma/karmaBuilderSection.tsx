import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { KarmaSection } from "#/components/runner/karma/karmaSection.tsx"

export const KarmaBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.karma}>
      <KarmaSection />
    </BuilderSection>
  )
}
