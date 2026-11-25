import type { FC } from "react"

import { BuilderSection } from "#/app/components/builder/builderSection.tsx"
import { FinancesSection } from "#/app/components/runner/sections/finances/viewer/financesSection.tsx"
import { BuilderSectionId } from "#/state/builder/builderSectionId.ts"

export const FinancesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.finances}>
      <FinancesSection />
    </BuilderSection>
  )
}
