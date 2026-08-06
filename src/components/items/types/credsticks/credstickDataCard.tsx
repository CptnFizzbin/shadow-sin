import type { FC } from "react"

import { EntityCard } from "#/components/entityCard/entityCard.tsx"
import { ItemCard } from "#/components/itemCard/itemCard.tsx"
import { formatNuyen } from "#/components/ui/nuyen.tsx"
import type { CredstickData } from "#/system/gear/credstickData.ts"
import { CredstickMaxBalance, CredstickTypeLabel } from "#/system/gear/credstickData.ts"

interface CredstickDataCardProps {
  credstick: CredstickData
  onOpen?: () => void
  onEdit?: () => void
}

export const CredstickDataCard: FC<CredstickDataCardProps> = ({ credstick, onOpen, onEdit }) => {
  const maxBalance = CredstickMaxBalance[credstick.credstickType]
  const fillPercent = maxBalance > 0 ? (credstick.balance / maxBalance) * 100 : 0

  return (
    <ItemCard
      item={credstick.name ? credstick : { ...credstick, name: CredstickTypeLabel[credstick.credstickType] }}
      onOpen={onOpen}
      onEdit={onEdit}
    >
      <EntityCard.Layout.HeaderRow>
        <ItemCard.SubType label={CredstickTypeLabel[credstick.credstickType]} />
      </EntityCard.Layout.HeaderRow>

      <EntityCard.Layout.BodyRow>
        <ItemCard.Stat value={formatNuyen(credstick.balance)} type="rating" />
        <ItemCard.Stat value={`${fillPercent.toFixed(0)}% full`} />
      </EntityCard.Layout.BodyRow>
    </ItemCard>
  )
}
