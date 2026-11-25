import type { FC } from "react"

import { ItemCard } from "#app/components/ui/cards/itemCard/itemCard.tsx"
import type { CredstickData } from "#data/items/credstickData.ts"
import { CredstickMaxBalance, CredstickTypeLabel } from "#data/items/credstickData.ts"
import { formatNuyen } from "#forms/nuyen/nuyen.tsx"

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
      <ItemCard.SubType label={CredstickTypeLabel[credstick.credstickType]} />

      <ItemCard.Stat value={formatNuyen(credstick.balance)} type="rating" />
      <ItemCard.Stat value={`${fillPercent.toFixed(0)}% full`} />
    </ItemCard>
  )
}
