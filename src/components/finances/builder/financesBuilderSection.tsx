import type { FC } from "react"

import { BuilderSection } from "#/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { FinancesSection } from "#/components/finances/viewer/financesSection.tsx"

export const FinancesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.finances}>
      <FinancesSection />
    </BuilderSection>
  )
}
