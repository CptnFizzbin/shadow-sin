import type { FC } from "react"

import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import { GearSection } from "#/components/CharacterBuilder/Sections/Gear/GearSection.tsx"
import { useGearAlerts } from "#/components/CharacterBuilder/Sections/Gear/UseGearAlerts.ts"

export const GearBuilderSection: FC = () => {
  return (
    <BuilderSection title="Gear" alerts={useGearAlerts()}>
      <GearSection />
    </BuilderSection>
  )
}
