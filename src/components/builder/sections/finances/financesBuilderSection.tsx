import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { FinancesSection } from "#/components/runner/finances/financesSection.tsx"

export const FinancesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.finances}>
      <FinancesSection />
    </BuilderSection>
  )
}
