import type { FC } from "react"

import type { EntityCardProps } from "#/components/entityCard/entityCard.tsx"
import { EntityCard } from "#/components/entityCard/entityCard.tsx"
import { EntityCardElements } from "#/components/entityCard/entityCardElements.tsx"
import { getAdeptPowerBpCost } from "#/components/runner/adeptPowers/adeptPowersUtils.ts"
import { PowerPoints } from "#/components/ui/powerPoints.tsx"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"

interface PowerCardProps extends Omit<EntityCardProps, "entity"> {
  power: AdeptPowerData
}

/**
 * Category tier from ADR-0010, sitting between `EntityCard` (universal) and `AdeptPowerData` —
 * there's no further typed-card split beneath it, since Adept Power is the only Power category
 * currently in the Entity system (CritterPowerData is out of scope). Adept Power has no
 * incremental elements of its own (unlike Item's Availability/Cost/...): `EntityCard` already
 * auto-renders Rating from `power.rating`, so `PowerCard` only adds CostPerRating, via
 * `EntityCard`'s generic `.Stat`, plus the power's total Power Point cost (rating × costPerRating)
 * alongside it in the body row. `onOpen`/`onEdit`/`onRemove`/`leftAction` pass straight through to
 * `EntityCard`.
 */
const PowerCardRoot: FC<PowerCardProps> = ({ power, children, ...props }) => (
  <EntityCard entity={power} {...props}>
    <EntityCard.Layout.BodyRow>
      <EntityCard.Stat label="Cost/Rating" value={power.costPerRating} />
      <PowerPoints value={getAdeptPowerBpCost(power)} />
    </EntityCard.Layout.BodyRow>

    {children}
  </EntityCard>
)

PowerCardRoot.displayName = "PowerCard"

/**
 * `EntityCardElements` re-exposed by name (not a blind spread, mirroring `ItemCardElements`)
 * since `PowerCard` doesn't add any incremental elements of its own.
 */
export const PowerCard = Object.assign(PowerCardRoot, EntityCardElements, { Layout: EntityCard.Layout })
