import type { FC, PropsWithChildren } from "react"

import { EntityCard } from "#/components/entityCard/entityCard.tsx"
import { EntityCardElements } from "#/components/entityCard/entityCardElements.tsx"
import { getAdeptPowerBpCost } from "#/components/runner/adeptPowers/adeptPowersUtils.ts"
import { PowerPoints } from "#/components/ui/powerPoints.tsx"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"

export interface PowerCardProps extends PropsWithChildren {
  power: AdeptPowerData
  /** When provided, the whole card becomes tappable/keyboard-activatable and invokes this (e.g. open the power's edit dialog). */
  onOpen?: () => void
  /** When provided, adds an "Edit" action (long-press/right-click menu). */
  onEdit?: () => void
  /** When provided, adds a "Remove" action (long-press/right-click menu). */
  onRemove?: () => void
}

/**
 * Category tier from ADR-0010, sitting between `EntityCard` (universal) and `AdeptPowerData` —
 * there's no further typed-card split beneath it, since Adept Power is the only Power category
 * currently in the Entity system (CritterPowerData is out of scope). Adept Power has no
 * incremental elements of its own (unlike Item's Availability/Cost/...): `EntityCard` already
 * auto-renders Rating from `power.rating`, so `PowerCard` only adds CostPerRating, via
 * `EntityCard`'s generic `.Stat`, plus the power's total Power Point cost (rating × costPerRating)
 * alongside it in the body row.
 */
const PowerCardRoot: FC<PowerCardProps> = ({ power, onOpen, onEdit, onRemove, children }) => (
  <EntityCard entity={power} onOpen={onOpen} onEdit={onEdit} onRemove={onRemove}>
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
